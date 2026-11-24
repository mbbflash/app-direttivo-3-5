## Context

Le motivazioni sono in proposal.md, i requisiti nelle specifiche. Vincoli:
- **Telegram Bot API**:
  - un bot non può creare gruppi né aggiungere persone;
  - non può trovare un utente dal numero di telefono;
  - non può scrivere a chi non lo ha mai avviato. Fa eccezione chi ha appena chiesto di entrare in un gruppo dove il bot è amministratore: il bot può scrivergli per qualche minuto tramite `user_chat_id`;
  - può creare link d'invito con limite di persone (`member_limit`) o con richiesta di approvazione (`creates_join_request`), e può approvare le richieste.
- **Lo script esiste già** (`crea-form-escursione`): è collegato al foglio database, gira con l'account dell'associazione, ha un attivatore al minuto e un lock.
- **Le web app Apps Script rispondono ai webhook con un reindirizzamento**, che Telegram tratta come errore e a cui reagisce rimandando gli stessi aggiornamenti. Per questo il bot usa il polling (`getUpdates`).
- **L'app identifica le uscite con l'ID del foglio risposte** (`esc.id`) e i partecipanti con una chiave che dipende dall'abbinamento al Libro Soci. Lo script il Libro Soci non lo legge.
- **Il numero normalizzato** (solo cifre, senza `39` iniziale se il numero ha più di 10 cifre) è la stessa regola che l'app usa per abbinare i soci.

## Goals / Non-Goals

**Goals:**
- Zero costi e nessun server oltre allo script già installato.
- Nessun messaggio a chi non ha mai scritto al bot e nessuna aggiunta forzata ai gruppi: ogni persona entra per scelta propria.
- Rendere gli inviti ripetibili: il bot riprende da dove era rimasto anche dopo errori o pause.

**Non-Goals:**
- Inviti in tempo reale: un ritardo di qualche minuto va bene.
- Gestione dei membri dopo l'ingresso (rimozioni, uscite cancellate).

## Decisions

### 1. Polling nello stesso attivatore dello script
`esegui()` fa prima le richieste della scheda `Richieste` (come oggi), poi `telegram_()`:
1. chiama `getUpdates` con `offset` salvato nelle proprietà dello script, `timeout=0` e `allowed_updates` = `message`, `my_chat_member`, `chat_join_request`;
2. gestisce ogni aggiornamento;
3. salva il nuovo `offset`.

`installa()` chiama anche `deleteWebhook`, perché polling e webhook non possono convivere.
*Alternativa scartata:* il webhook verso una web app Apps Script. Le risposte con reindirizzamento provocano consegne ripetute, e servirebbe un indirizzo pubblico da proteggere.

### 2. Token e nome del bot
Il token si inserisce a mano in **Impostazioni progetto → Proprietà dello script**, con nome `TELEGRAM_TOKEN`. Non si mette mai nel codice, così copiare lo script nel repository non lo espone. Se il token manca, la parte Telegram si salta in silenzio, e le richieste di creazione delle uscite continuano a funzionare.
Il nome utente del bot (`@…`) è pubblico: va in `config.js` (`telegramBot`) e l'app lo usa nella guida e nei testi.

### 3. Chiavi e schede
- **`Telegram`**: una riga per numero normalizzato, che è la chiave. L'ultimo collegamento vince (requisito "Collegamento numero e utente Telegram").
- **`Gruppi_Telegram`**: una riga per `chat_id`. Lo script scrive `chat_id`, `nome_gruppo`, `bot_admin`, `registrato_il` e `link_condiviso`. L'app scrive `escursione_id` (l'ID del foglio dell'uscita), `escursione`, `aggiornato_il` e `aggiornato_da`. Ognuno scrive solo le sue colonne, cella per cella, così non si sovrascrivono.
- **`Inviti_Telegram`**: chiave `<escursione_id>::p:<telefono>` per gli iscritti con un numero, `<escursione_id>::e:<email>` per quelli senza numero (li crea l'app quando segna l'email inviata), `<escursione_id>::tg:<telegram_id>` per le richieste di accesso in attesa.
- **Gli stati**:
  - `inviato_telegram`, `da_email`, `entrato` (dal bot);
  - `email_inviata` (dall'app);
  - `richiesta_in_attesa`, con il motivo nella colonna `nota` (dal bot).

L'app abbina gli inviti ai propri iscritti tramite il numero normalizzato o l'email, senza bisogno che lo script conosca il Libro Soci.

### 4. Lettura degli iscritti da parte dello script
Per ogni riga di `Gruppi_Telegram` con un'uscita abbinata, il bot amministratore e la data dell'uscita non passata (letta dal nome del foglio con la stessa regola dell'app), lo script apre il foglio con `SpreadsheetApp.openById(escursione_id)` e legge il primo foglio. Riconosce le colonne del telefono e del nome dall'intestazione, con le stesse parole dell'app ("telefono", "cellulare", "tel"; "nome"). Questo controllo si fa al massimo ogni 10 minuti: l'ora dell'ultimo giro è salvata nelle proprietà. Il polling degli aggiornamenti resta invece ogni minuto.

### 5. Inviti
- **Link condiviso**: creato una volta per gruppo quando il gruppo è abbinato e il bot è amministratore, con `createChatInviteLink(creates_join_request=true, name="Email <uscita>")`. Viene salvato in `link_condiviso`.
- **Link personale**: con `createChatInviteLink(member_limit=1, expire_date=giorno dopo l'uscita, name=<telefono>)`, mandato con `sendMessage` all'utente collegato. Se Telegram risponde 403 (bot bloccato), il collegamento passa a `stop` e l'invito a `da_email`.
- **Chi è già nel gruppo** (riconosciuto da `chat_member` o dal successo dell'approvazione) diventa `entrato`. Per i link personali basta lo stato `inviato_telegram`: non serve confermare l'ingresso.
- **Il bot non riscrive mai a chi ha già ricevuto un invito** per la stessa uscita.

### 6. Portinaio
Su `chat_join_request`:
- se `from.id` è già collegato, si usa il suo numero;
- altrimenti il bot manda a `user_chat_id` un messaggio con un pulsante `request_contact` e salva la richiesta come `richiesta_in_attesa` ("in attesa del numero").

Quando arriva un messaggio con `contact`:
- se `contact.user_id` è diverso da `from.id`, il contatto viene rifiutato;
- altrimenti il numero viene salvato in `Telegram` e confrontato con le richieste in attesa di quell'utente. Se il numero è tra gli iscritti dell'uscita, il bot chiama `approveChatJoinRequest` e la richiesta diventa `entrato`. Altrimenti resta `richiesta_in_attesa` con il motivo "non iscritto".

Le richieste non vengono mai rifiutate in automatico: decide il direttivo.

### 7. App: guida, stato ed email
- `clouddb.js` aggiunge le tre schede a `TABS` e alla lettura iniziale (`batchGet`). Scrive l'abbinamento in `Gruppi_Telegram` e "email inviata" in `Inviti_Telegram`, con scritture dirette sulla riga della chiave, come le altre schede.
- **Lo stato della guida** si ricava dai dati e non si salva:
  - nessuna riga di `Gruppi_Telegram` per l'uscita → passi 1 e 2;
  - gruppi registrati ma non abbinati → passo 3;
  - abbinato senza `link_condiviso` → "inviti in preparazione";
  - iscritti `da_email` → passo 5;
  - altrimenti → "tutto fatto".
- **L'email con il link condiviso** riusa il meccanismo `mailto:?bcc=` già usato per le comunicazioni ai partecipanti.
- **Il nome suggerito per il gruppo** è `Tre Quinti - <nome uscita> <GG/MM>`.

### 8. Demo
`demo.js` aggiunge al database demo un gruppo registrato e non abbinato, due collegamenti e alcuni inviti, così la guida si può percorrere tutta. Telegram non viene mai chiamato: in demo lo script non c'è.

## Risks / Trade-offs

- [Tempo di esecuzione giornaliero di Apps Script sugli account Gmail] → Il polling a vuoto è una sola chiamata breve. La lettura dei fogli avviene ogni 10 minuti e solo per le uscite attive. Il compito 1.3 di `crea-form-escursione` e il compito 1.4 di questa change misurano i tempi reali prima del rilascio.
- [`user_chat_id` valido solo pochi minuti dopo la richiesta di accesso] → Il polling al minuto sta nei tempi. Se il messaggio non parte, la richiesta resta "da decidere" e l'app la mostra.
- [Numero nel form scritto male o diverso da quello di Telegram] → L'invito passa a `da_email`, e il portinaio lascia la richiesta al direttivo. Nessuna esclusione automatica.
- [Il link condiviso inoltrato a estranei] → Serve l'approvazione, e il bot approva solo i numeri iscritti.
- [Dati personali (telefono ↔ utente Telegram) nel foglio database] → Restano nel Drive dell'associazione, mai nel repository. Va aggiornata l'informativa privacy, che è fuori da questa change ma è segnalata nella guida.
- [Scritture concorrenti di app e script sulla stessa riga di `Gruppi_Telegram`] → Ciascuno scrive solo le proprie colonne, cella per cella.

## Migration Plan

1. Creare il bot con BotFather e inserire `TELEGRAM_TOKEN` nelle proprietà dello script. Aggiornare lo script e rieseguire `installa()`, che toglie l'eventuale webhook.
2. Aggiungere a mano, nel messaggio di conferma del form template, l'invito a scrivere al bot.
3. Rilasciare l'app con `telegramBot` in `config.js`. Le nuove schede si creano da sole.
4. Ritorno indietro: togliere `TELEGRAM_TOKEN` dalle proprietà, e il bot si ferma; poi rilasciare la versione precedente dell'app. Le schede possono restare.

## Open Questions

- Il testo esatto dei messaggi del bot e dell'email: si rifinisce durante l'implementazione senza cambiare il comportamento.
