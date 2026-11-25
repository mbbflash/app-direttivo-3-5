## Why

Per ogni nuova escursione il direttivo clona a mano il form template, lo rinomina, cambia il titolo, collega il foglio risposte e rinomina anche quello, rispettando le sintassi che l'app usa per riconoscere le uscite. Sono passaggi ripetitivi in cui un errore di nome rende l'uscita invisibile all'app. Un pulsante nell'app che fa tutto da solo elimina il lavoro e gli errori. Inoltre mette in piedi l'esecutore Apps Script che servirà poi al bot Telegram (change `bot-telegram-gruppi-escursione`).

## What Changes

- Nuovo pulsante **"Nuova escursione programmata (Crea Form + Foglio risposte)"** nella scheda Escursioni. Chiede il nome dell'escursione, la data e, facoltativa, la data di fine per le uscite di più giorni.
- L'app non crea i file direttamente: scrive una **richiesta** in una nuova scheda del database condiviso. La esegue entro pochi minuti uno script Apps Script collegato al foglio database, che gira con l'account dell'associazione.
- Lo script:
  - copia il form `[TEMPLATE] Form Iscrizione aaaa.mm.gg - "Nome Escursione"`, trovato per nome, nella stessa cartella del template;
  - dà alla copia il nome `Form iscrizione AAAA.MM.GG - "Nome"` e il titolo `✒️ Nome - domenica 22/11/2026`, con il giorno della settimana calcolato;
  - crea il foglio `Iscrizioni AAAA.MM.GG - Nome (Risposte)` e lo collega al form come destinazione delle risposte;
  - lascia invariato tutto il resto del template: descrizione, domande, ramo SI/NO, impostazioni, messaggio di conferma.
- L'app mostra l'avanzamento e, a lavoro finito, il link da compilare (con "Copia link") e il link per modificare il form. La nuova uscita compare da sola nella scheda Escursioni.
- Controlli: l'app avvisa se esiste già un'uscita con la stessa data e lo stesso nome e non la duplica. Segnala una data nel passato senza bloccarla. Mostra in italiano gli errori dello script (template non trovato, file già esistente).
- In `?demo=1` la creazione è simulata, senza toccare Google.
- Il codice dello script sta nel repository, senza segreti né ID. Una guida spiega come installarlo una volta sola sull'account dell'associazione.

Fogli Google:
- scritto dall'app: "NON TOCCARE - DATABASE APP DI GESTIONE", nuova scheda `Richieste`. **Lo schema del database condiviso cambia.**
- creati dallo script: un nuovo form (copia del template) e il suo foglio risposte "Iscrizioni AAAA.MM.GG - …";
- letto dallo script: il form template, mai modificato;
- i fogli risposte esistenti, il Libro Soci e gli altri fogli non vengono toccati.

Fuori da questa modifica:
- bot Telegram, gruppi e messaggio di conferma del form con il link al bot (change `bot-telegram-gruppi-escursione`);
- precompilazione dai dati della scheda tecnica dell'assistente "Prossima uscita";
- chiusura automatica delle iscrizioni (data limite o numero massimo di posti);
- modifica del contenuto del form dopo la creazione: si fa a mano dal link di modifica;
- creazione di eventi nel calendario o annunci sui social.

Dipende da `sintassi-fogli-iscrizioni`: l'app deve riconoscere i fogli "Iscrizioni AAAA.MM.GG - …".

## Capabilities

### New Capabilities
- `automazioni-apps-script`: esecutore Apps Script sull'account dell'associazione, che prende in carico le richieste dell'app dalla scheda `Richieste` del database e ne registra stato e risultato. Sarà riusato dal bot Telegram.
- `creazione-uscite`: creazione di una nuova uscita dall'app (form clonato dal template e foglio risposte collegato), con i nomi nelle sintassi riconosciute.

### Modified Capabilities
- `database-condiviso`: lo schema aggiunge la scheda `Richieste`.

## Impact

- `docs/index.html`: pulsante, finestra di inserimento, stato della richiesta e risultato nella scheda Escursioni.
- `docs/js/clouddb.js`: nuova scheda `Richieste` (creazione con intestazioni, scrittura della richiesta, lettura dello stato).
- `docs/js/demo.js`: simulazione della creazione.
- Nuova cartella `apps-script/` con il codice dello script e una guida di installazione (`SETUP-APPS-SCRIPT.md`). Nessuna dipendenza esterna né build step.
- Permessi: lo script chiede all'account dell'associazione, una sola volta all'installazione, l'accesso a Moduli, Drive e Fogli. I permessi di login dell'app non cambiano.
- Limiti Google: lo script ha un attivatore a tempo (ogni minuto) che legge solo la scheda `Richieste` e rientra nei limiti giornalieri gratuiti di Apps Script. Mentre aspetta una richiesta, l'app ricontrolla la scheda ogni 10 secondi, per al massimo pochi minuti. L'impatto sul limite di richieste condiviso è trascurabile.
- Rilascio: nuova versione (config, `?v=`, cache del service worker, version.json).
