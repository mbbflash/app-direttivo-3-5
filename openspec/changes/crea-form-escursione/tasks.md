## 1. Script Apps Script ed esecutore delle richieste

- [ ] 1.1 Creare `apps-script/appsscript.json` (scope moduli, Drive, fogli, attivatori; fuso orario Europe/Rome) e `apps-script/Codice.gs` con lettura della scheda `Richieste`, lock, passaggio di stato `in_attesa` → `in_corso` → `fatto`/`errore` e scarto delle richieste `in_corso` da più di 10 minuti; verificare dall'editor Apps Script con una riga di prova di tipo sconosciuto, che deve finire in `errore` con un messaggio chiaro
- [ ] 1.2 Aggiungere la funzione `installa()`, che crea l'attivatore a tempo ogni minuto senza duplicarlo, e scrivere `SETUP-APPS-SCRIPT.md` con i passi di installazione, aggiornamento e verifica; verificare seguendo la guida sull'account dell'associazione che l'attivatore compaia una sola volta
- [ ] 1.3 Prova pratica: misurare nella pagina "Esecuzioni" la durata delle esecuzioni a vuoto in un'ora e verificare se un attivatore `onChange` scatta per una riga aggiunta via Sheets API; annotare l'esito nel design (aggiungere `onChange` solo se funziona)
- [ ] 1.4 Verificare con grep che `apps-script/` non contenga ID di file, URL privati o token

## 2. Creazione dell'uscita nello script

- [ ] 2.1 Implementare il tipo `crea_uscita`: calcolo dei nomi (un giorno e più giorni, giorno della settimana in italiano e in minuscolo), ricerca del template per nome (esattamente uno) e controllo che non esistano già file con il nome del form o del foglio; verificare dall'editor con richieste di prova: template mancante e nome già usato devono finire in `errore` senza creare file
- [ ] 2.2 Copiare il template nella sua cartella, impostare il titolo, creare il foglio, spostarlo, collegarlo come destinazione, eliminare il foglio iniziale vuoto e scrivere il risultato con link da compilare e di modifica; in caso di errore cestinare i file creati; verificare con una richiesta di prova che nel Drive compaiano `Form iscrizione AAAA.MM.GG - "…"` e `Iscrizioni AAAA.MM.GG - … (Risposte)`, che il form abbia descrizione, sezioni e conferma del template e che una risposta di prova finisca nel primo foglio
- [ ] 2.3 Verificare un'uscita di due giorni (nomi `AAAA.MM.GG-GG` e titolo con due giorni) e cancellare a mano i file di prova

## 3. App: scheda Richieste e pulsante

- [ ] 3.1 In `docs/js/clouddb.js` aggiungere la scheda `Richieste` a `TABS` (creata con le intestazioni se manca, fuori dalla `batchGet` iniziale), una funzione per aggiungere una richiesta e una per leggerne lo stato; verificare con login che la scheda venga creata e che la riga di richiesta compaia nel foglio
- [ ] 3.2 In `docs/index.html` aggiungere nella scheda Escursioni il pulsante "Nuova escursione programmata (Crea Form + Foglio risposte)" e la finestra con nome, data e data di fine facoltativa, con controlli di campi, duplicati e data passata; verificare in `?demo=1` gli scenari "Nome mancante", "Uscita già esistente" e "Data passata"
- [ ] 3.3 Mostrare lo stato della richiesta con ricontrollo ogni 10 secondi e stop dopo 5 minuti; a lavoro finito mostrare "Form pronto" con "Copia link" e "Apri il form" e ricaricare l'elenco delle uscite; verificare in demo, interfaccia chiara, scura e da telefono
- [ ] 3.4 Simulazione in `docs/js/demo.js` (richiesta completata dopo circa 3 secondi, link finti, nuova uscita nell'elenco demo); verificare con `?demo=1` che nessuna chiamata a Google parta
- [ ] 3.5 Documentare la funzione nel README (funzionalità e tabella "Dove finiscono i dati": scheda `Richieste`, form e fogli creati dallo script) con un rimando a `SETUP-APPS-SCRIPT.md`

## 4. Rilascio

- [ ] 4.1 Portare la versione a 2.5.0 in `config.js`, `?v=` in `index.html` e `manifest.webmanifest`, cache in `sw.js`, note in `version.json`; verificare in `?demo=1` che l'app mostri 2.5.0
- [ ] 4.2 Dopo il push, prova con login sui dati veri: creare un'uscita di prova dall'app, controllare form, foglio e link, verificare che l'uscita compaia in Escursioni, poi cestinare a mano form e foglio di prova

## Workflow follow-up

- Implementare e archiviare prima `sintassi-fogli-iscrizioni`, da cui questa change dipende.
- Archiviare questa change (`openspec archive crea-form-escursione`) dopo la prova con i dati veri.
