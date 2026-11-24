## Why

Per ogni escursione il direttivo vuole un gruppo Telegram con i soli iscritti. Oggi il link del gruppo si manda a mano, una persona alla volta. Telegram non permette ai bot di creare gruppi né di aggiungere persone partendo dal numero di telefono. Un bot gratuito può però conoscere gli iscritti che gli hanno scritto almeno una volta, mandare loro un link personale, e fare da "portinaio" per chi arriva dal link inviato via email, ammettendo solo chi risulta iscritto. Lo script Apps Script introdotto da `crea-form-escursione` è la base su cui farlo girare, senza costi né server.

## What Changes

- **Bot Telegram dell'associazione**, gestito dallo script Apps Script già collegato al foglio database. Il token sta solo nelle proprietà dello script.
- **Primo contatto con il bot**: chi scrive al bot, per esempio dal link nel messaggio di conferma del form, deve condividere il proprio numero di telefono prima di poter fare altro. Il bot accetta solo il contatto della persona stessa e salva il collegamento numero ↔ utente Telegram. Il comando `/stop` interrompe i messaggi, `/start` li riattiva.
- **Gruppo dell'uscita**, creato a mano con la guida passo passo dell'app:
  1. l'app segnala che un'uscita nuova non ha ancora un gruppo e suggerisce il nome;
  2. si crea il gruppo e si aggiunge il bot come amministratore; il bot se ne accorge e registra il gruppo;
  3. nell'app si abbina il gruppo all'uscita;
  4. il bot invia gli inviti;
  5. l'app prepara l'email in CCN per chi non ha ricevuto l'invito su Telegram;
  6. da lì in poi anche i nuovi iscritti ricevono il link in automatico, oppure vengono segnalati per l'email.
- **Inviti**:
  - agli iscritti collegati il bot manda in privato un **link personale valido per una sola persona**;
  - per gli altri c'è un **link condiviso con richiesta di accesso**, da mandare via email in CCN.
- **Portinaio**: chi chiede di entrare con il link condiviso riceve dal bot la richiesta di condividere il numero. Se il numero è tra gli iscritti dell'uscita, il bot lo ammette e lo collega per le volte successive. Altrimenti la richiesta resta in attesa e l'app la segnala al direttivo, che decide in Telegram.
- **Stato degli inviti per iscritto**, salvato nel database condiviso: inviato su Telegram, da mandare via email, email inviata, entrato.
- **Collegamento visibile nell'app**: nella scheda dell'uscita compare lo stato Telegram di ogni iscritto, e nella scheda socio compare "collegato a Telegram" quando il numero coincide.
- **In demo** (`?demo=1`) bot e gruppi sono simulati.
- Guida di configurazione del bot (BotFather, token, messaggio di conferma del template) aggiunta a `SETUP-APPS-SCRIPT.md`.

Fogli Google:
- scritte da script e app, nel foglio "NON TOCCARE - DATABASE APP DI GESTIONE": le nuove schede `Telegram` (collegamenti numero ↔ utente), `Gruppi_Telegram` (gruppi e abbinamento alle uscite) e `Inviti_Telegram` (stato per iscritto). **Lo schema del database condiviso cambia.**
- letti dallo script: i fogli risposte delle uscite abbinate a un gruppo, in sola lettura;
- il form template viene modificato **a mano, una volta sola**, per aggiungere il link al bot nel messaggio di conferma.

Fuori da questa modifica:
- creazione automatica dei gruppi o aggiunta diretta delle persone: Telegram non lo consente ai bot;
- WhatsApp e qualsiasi servizio a pagamento;
- invio automatico delle email: l'email in CCN resta preparata dall'app e spedita dal programma di posta;
- rimozione dal gruppo di chi si cancella dall'uscita;
- aggiornamento dell'informativa privacy dell'associazione, che va fatto a parte e a mano (il bot tratta il numero di telefono e l'utente Telegram).

Dipende da `crea-form-escursione`, che introduce lo script e la scheda `Richieste`, e da `sintassi-fogli-iscrizioni`.

## Capabilities

### New Capabilities
- `bot-telegram`: comportamento del bot. Copre primo contatto con condivisione del numero, collegamento numero ↔ utente, `/stop` e `/start`, registrazione dei gruppi, invio dei link personali e portinaio delle richieste di accesso.
- `gruppi-telegram`: guida passo passo nell'app per il gruppo di ogni uscita, abbinamento gruppo ↔ uscita, stato degli inviti per iscritto ed email in CCN con il link condiviso.

### Modified Capabilities
- `database-condiviso`: lo schema aggiunge le schede `Telegram`, `Gruppi_Telegram` e `Inviti_Telegram`.

## Impact

- `apps-script/Codice.gs`: lettura degli aggiornamenti del bot (polling), comandi, gruppi, inviti e portinaio; nuova funzione di configurazione del token.
- `docs/js/clouddb.js`: nuove schede e loro lettura e scrittura.
- `docs/index.html`: guida passo passo e stato Telegram nella scheda Escursioni, indicatore nella scheda socio, email in CCN dedicata.
- `docs/js/demo.js`: simulazione.
- `SETUP-APPS-SCRIPT.md`, `README.md`.
- API esterne: Telegram Bot API (gratuita), chiamata solo dallo script, mai dal browser.
- Limiti Google: il polling di Telegram usa lo stesso attivatore al minuto dello script. Le letture dei fogli delle uscite si limitano alle uscite abbinate e non ancora passate, e si fanno al massimo ogni 10 minuti. L'app legge le nuove schede insieme al resto del database.
- Rilascio: nuova versione (config, `?v=`, cache del service worker, version.json).
