# Script di automazione (Apps Script)

Alcune operazioni l'app nel browser non le può fare da sola, per esempio creare il form di una nuova escursione e collegargli il foglio delle risposte. Le fa uno **script Apps Script** collegato al foglio database, che gira con l'account dell'associazione:

```
app  --scrive una richiesta-->  foglio database, scheda "Richieste"
                                        |
                       script (ogni minuto) la esegue
                                        |
app  <--legge stato e risultato--  scheda "Richieste"
```

Il codice è nella cartella [`apps-script/`](apps-script/) di questo repository e non contiene ID, link privati o password: i file si trovano per nome.

## Installazione (una volta sola)

1. Accedi a Google con **trequintitrekking@gmail.com** e apri il foglio **NON TOCCARE - DATABASE APP DI GESTIONE**.
2. Menu **Estensioni → Apps Script**. Si apre l'editor dello script collegato al foglio.
3. Nella colonna a sinistra:
   - apri il file `Codice.gs` (se si chiama `Code.gs` va bene uguale), cancella tutto e incolla il contenuto di [`apps-script/Codice.gs`](apps-script/Codice.gs);
   - clicca l'ingranaggio **Impostazioni progetto** e spunta **"Mostra il file manifest appsscript.json nell'editor"**; torna all'editor, apri `appsscript.json`, cancella tutto e incolla il contenuto di [`apps-script/appsscript.json`](apps-script/appsscript.json).
4. Salva (icona del dischetto o Ctrl+S). Come nome del progetto va bene "Automazioni APP Direttivo".
5. In alto scegli la funzione **`installa`** e premi **Esegui**. Google chiede i permessi:
   - "Rivedi autorizzazioni" → scegli l'account dell'associazione;
   - se compare "Google non ha verificato questa app": **Avanzate → Vai a … (non sicuro)**. È normale per gli script personali: lo script è vostro e gira solo sul vostro account;
   - consenti l'accesso a Fogli, Moduli e Drive.
6. Nel registro deve comparire `Installato: attivatore "esegui" ogni minuto.`

## Verifica

- Nell'editor, a sinistra, **Attivatori** (icona della sveglia): deve esserci **un solo** attivatore `esegui`, "A tempo, ogni minuto". Se ce ne sono due, eliminane uno.
- **Esecuzioni** (icona con le righe): ogni minuto compare un'esecuzione di `esegui` che dura pochi istanti.
- Facoltativo: scegli la funzione **`provaNomi`** e premi **Esegui**. Nel registro vedi i nomi e i titoli che lo script darebbe a tre uscite di esempio, senza creare nulla.
- Nel foglio database c'è la scheda **Richieste**. Se manca, la crea lo script o l'app al primo utilizzo.

## Aggiornamento

Quando il codice in `apps-script/` cambia, ripeti i passi 2–4 incollando la versione nuova. Non serve rieseguire `installa`, a meno che le note della versione non lo dicano: l'attivatore resta quello di prima.

### Domande sulle auto nel modulo template (v2.6.1)

Dopo aver incollato il `Codice.gs` nuovo, scegli la funzione **`aggiungiDomandeAuto`** e premi **Esegui** una volta. Lo script aggiunge al form template due domande usate dalla sezione *Auto per l'uscita* dell'app:

- dopo "Città da dove parti": *📍 Ci vediamo al punto di ritrovo o vai direttamente alla partenza dell'escursione?* (Al punto di ritrovo / Direttamente alla partenza);
- dopo "saresti disposto/a a mettere il tuo mezzo a disposizione?": *🪑 Se metti il tuo mezzo a disposizione, quanti posti liberi hai (escluso te)?* (da 1 a 6, facoltativa).

Nel registro compare il messaggio con le domande aggiunte. Se le domande ci sono già, non cambia nulla. Le uscite create da quel momento le avranno; quelle già create restano come sono. Apri il template e controlla che le due domande siano nel punto giusto: se serve, spostale a mano.

## Se qualcosa non va

| Sintomo | Cosa fare |
|---|---|
| Nell'app: "Lo script di automazione non ha risposto" | Controlla in **Attivatori** che `esegui` ci sia e in **Esecuzioni** che non dia errori. Se l'attivatore manca, riesegui `installa`. |
| Errore "Non trovo il form con il nome del template" | Nel Drive deve esserci un solo form chiamato esattamente `[TEMPLATE] Form Iscrizione aaaa.mm.gg - "Nome Escursione"`. Se lo rinomini, aggiorna `TEMPLATE_NAME` in cima a `Codice.gs`. |
| Errore "Esiste già un file chiamato …" | Il form o il foglio di quell'uscita esistono già: usa quelli o cestinali prima di riprovare. |
| Una richiesta resta "in corso" | Dopo 10 minuti lo script la segna come errore ("Esecuzione interrotta: riprova"): basta rifare la richiesta dall'app. |

Per disattivare tutto: in **Attivatori** elimina `esegui`. L'app smette di poter creare uscite, ma tutto il resto continua a funzionare.
