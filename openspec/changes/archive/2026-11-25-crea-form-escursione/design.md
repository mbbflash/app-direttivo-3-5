## Context

Le motivazioni sono in proposal.md, i requisiti nelle specifiche. Vincoli che decidono l'architettura:
- L'app è una PWA senza backend: il browser usa Drive API v3 e Sheets API v4 con gli scope `spreadsheets`, `drive.metadata.readonly` ed `email`.
- **Le API usate dal browser non possono collegare un form al suo foglio risposte.** La Forms API non espone la destinazione delle risposte. Apps Script invece può farlo (`FormApp` → `setDestination`).
- Il template va copiato così com'è. Riscrivere la descrizione da codice trasformerebbe in testo semplice i link con nome ("🔍 Descrizione Escursione"), mentre una copia del file conserva descrizione, sezioni, ramo SI/NO, impostazioni e messaggio di conferma.
- Tutto il direttivo usa lo stesso account Google, e quindi condivide lo stesso limite di richieste.
- Il database condiviso (`clouddb.js`) crea da solo le schede mancanti a partire dall'elenco `TABS` e legge le schede dei dati con una sola `batchGet`.

## Goals / Non-Goals

**Goals:**
- Creare form e foglio con un clic, senza aggiungere permessi al login dell'app.
- Mettere in piedi un esecutore riusabile dal bot Telegram: la stessa coda e lo stesso script, con nuovi tipi di richiesta.
- Nessuna dipendenza, nessun build step, nessun server da pagare o mantenere.

**Non-Goals:**
- Una risposta istantanea: un'attesa fino a circa un minuto è accettabile.
- Gestire più template o modificare form esistenti.

## Decisions

### 1. Apps Script collegato al foglio database, attivato dalla coda
Lo script è un progetto Apps Script **collegato** (bound) al foglio "NON TOCCARE - DATABASE APP DI GESTIONE" (Estensioni → Apps Script) e gira con l'account dell'associazione. Usa `SpreadsheetApp.getActive()` per arrivare alla scheda `Richieste`, quindi non serve nessun ID.
*Alternative scartate:*
- **Creare i file dal browser con Forms e Drive API**: non può collegare il foglio risposte, e richiederebbe scope nuovi (moduli, Drive in scrittura) con un nuovo consenso per tutti.
- **Web app Apps Script chiamata dall'app**: le risposte delle web app passano da un reindirizzamento (problematico con CORS dal browser) e servirebbe un indirizzo pubblico da proteggere. La coda nel foglio usa invece il login che l'app ha già.
- **Apps Script Execution API** (`scripts.run`): richiede che il token dell'app abbia anche gli scope dello script (moduli, Drive), cioè di nuovo più permessi al login.

### 2. Attivatore a tempo ogni minuto
Lo script ha un attivatore installabile a tempo, ogni minuto. Ogni esecuzione legge solo le righe non completate della scheda `Richieste` e termina subito se non ce ne sono. 1440 esecuzioni brevi al giorno rientrano nei limiti gratuiti di Apps Script per gli account Gmail. È la stessa cadenza che userà il bot Telegram in polling, quindi quel costo si paga una volta sola.
*Alternativa da verificare:* un attivatore `onChange` sul foglio database sarebbe più immediato, ma non è garantito che scatti per le scritture fatte via Sheets API. Il compito 1.3 lo verifica: se funziona, si affianca al timer per ridurre l'attesa. Il timer resta come rete di sicurezza.

### 3. Scheda `Richieste` e protocollo
Colonne: `id, tipo, parametri, stato, risultato, errore, creato_il, creato_da, completato_il`.
- `id`: generato dall'app (data e ora più un suffisso casuale).
- `tipo`: per ora solo `crea_uscita`.
- `parametri`: JSON, per esempio `{"nome":"giro di prova","data":"2026-11-22","data_fine":""}`.
- `stato`: `in_attesa` → `in_corso` → `fatto` | `errore`.
- `risultato`: JSON con `form_nome`, `foglio_nome`, `link_compilazione`, `link_modifica`.

Queste righe sono una cronologia, non stato da unire per chiave. L'app quindi le **aggiunge** (append) invece di usare la coda delle modifiche con "ultima versione per chiave". La richiesta parte subito se l'utente è collegato e online. Altrimenti l'app lo segnala e non mette la richiesta in coda per dopo: crearla più tardi potrebbe sorprendere. La scheda **non** entra nella `batchGet` iniziale: l'app la legge solo per seguire una richiesta, cioè una lettura di poche righe ogni 10 secondi per al massimo 5 minuti.

### 4. Niente doppie esecuzioni
Lo script prende `LockService.getScriptLock()` per tutta l'esecuzione. Se il lock non è disponibile, esce subito. Segna `in_corso` prima di lavorare e scarta le richieste `in_corso` più vecchie di 10 minuti (le segna `errore`).

### 5. Creazione dell'uscita
1. Trova il template con `DriveApp.getFilesByName` (deve esserci esattamente un form con quel nome).
2. Calcola i nomi: date `AAAA.MM.GG` oppure `AAAA.MM.GG-GG`, giorno della settimana in italiano e in minuscolo, titolo `✒️ Nome - domenica 22/11/2026` oppure `✒️ Nome - sabato 05/09 e domenica 06/09/2026`.
3. Controlla che nel Drive non esistano già file con il nome del form o del foglio. Se esistono, finisce in errore prima di creare qualcosa.
4. Copia il template nella sua cartella (`makeCopy(nome, cartella)`) e imposta solo il titolo (`FormApp.openById(copia).setTitle`).
5. Crea il foglio con `SpreadsheetApp.create(nomeFoglio)`, lo sposta nella cartella del form e lo collega con `form.setDestination(FormApp.DestinationType.SPREADSHEET, idFoglio)`. Google aggiunge al foglio la scheda delle risposte, e lo script elimina il foglio vuoto iniziale, così le risposte stanno nel primo foglio, come l'app si aspetta.
6. Scrive nel risultato `getPublishedUrl()` e `getEditUrl()`.

Se un passo fallisce dopo la copia, lo script sposta nel cestino i file che ha creato in quella richiesta, così non restano form a metà.

### 6. Controlli lato app
Il controllo dei duplicati usa l'elenco delle uscite già caricato e la funzione di riconoscimento dei nomi introdotta da `sintassi-fogli-iscrizioni`: confronta data e nome senza maiuscole. Il controllo dello script sul Drive copre i casi in cui l'elenco non è aggiornato.

### 7. Codice e installazione
- `apps-script/Codice.gs` e `apps-script/appsscript.json` nel repository. Il manifest dichiara gli scope (moduli, Drive, fogli, `script.scriptapp` per gli attivatori).
- `SETUP-APPS-SCRIPT.md` spiega i passi: aprire il foglio database con l'account dell'associazione, Estensioni → Apps Script, incollare i file, eseguire una volta la funzione `installa()` (che autorizza e crea l'attivatore), verificare.
- Si copiano i file a mano, senza strumenti esterni (niente `clasp`), per rispettare il vincolo "nessuna dipendenza". Ogni modifica allo script si ripete con lo stesso copia-incolla, e la guida lo dice.

### 8. Demo
In `?demo=1`, `clouddb` non scrive su Google: la richiesta diventa `fatto` dopo circa 3 secondi, con link finti, e il foglio demo nuovo viene aggiunto all'elenco in memoria.

## Risks / Trade-offs

- [Lo script non è installato o l'attivatore è stato disattivato] → Dopo 5 minuti senza risposta l'app lo dice e rimanda alla guida. La guida include un controllo ("Esecuzioni" nell'editor Apps Script).
- [Attesa fino a circa un minuto] → L'app mostra lo stato passo passo. Il compito 1.3 valuta `onChange` per accorciarla.
- [Limiti giornalieri di Apps Script sull'account condiviso] → Le esecuzioni a vuoto durano pochi decimi di secondo. Il compito 1.3 misura il tempo reale nella pagina "Esecuzioni" prima del rilascio.
- [Cambia il nome del template nel Drive] → La richiesta va in errore con il nome atteso. Il nome sta in una costante in cima allo script, facile da aggiornare.
- [La scheda delle risposte creata da Google non è la prima] → Lo script elimina il foglio iniziale vuoto (decisione 5). Il compito 2.3 lo verifica con l'app.
- [Le copie del template ereditano anche eventuali errori del template] → È voluto: si corregge il template una volta sola.

## Migration Plan

1. Installare lo script sull'account dell'associazione seguendo `SETUP-APPS-SCRIPT.md` e fare una prova manuale dall'editor.
2. Rilasciare la nuova versione dell'app. La scheda `Richieste` si crea da sola al primo accesso.
3. Ritorno indietro: rilasciare la versione precedente e disattivare l'attivatore dello script. La scheda `Richieste` può restare: non disturba.

## Open Questions

- Se l'attivatore `onChange` scatta per le scritture via API: si decide con il compito 1.3 e non cambia specifiche né struttura.
