## 1. Bot nello script

- [ ] 1.1 In `apps-script/Codice.gs` aggiungere la lettura di `TELEGRAM_TOKEN` dalle proprietà (parte Telegram saltata se manca), `deleteWebhook` in `installa()` e il polling `getUpdates` con offset salvato, chiamato da `esegui()` dopo le richieste; verificare dall'editor che senza token l'esecuzione resti uguale e che con il token l'offset avanzi
- [ ] 1.2 Gestire il primo contatto (richiesta del numero con pulsante, controllo che il contatto sia della persona stessa, salvataggio nella scheda `Telegram` con numero normalizzato, ultimo collegamento vince) e i comandi `/stop` e `/start`; verificare scrivendo al bot da un telefono: contatto proprio salvato, contatto altrui rifiutato, `/stop` che cambia lo stato
- [ ] 1.3 Gestire `my_chat_member` (registrazione dei gruppi in `Gruppi_Telegram` con `bot_admin` e messaggio nel gruppo se manca il permesso); verificare aggiungendo il bot a un gruppo di prova prima come membro e poi come amministratore
- [ ] 1.4 Inviti: per i gruppi abbinati con il bot amministratore e l'uscita non passata, al massimo ogni 10 minuti creare il link condiviso con richiesta di accesso, leggere gli iscritti dal foglio, mandare i link personali (`member_limit=1`) ai collegati attivi, segnare `inviato_telegram` o `da_email`, gestire il 403 con `stop`; verificare con un'uscita e un gruppo di prova (iscritto collegato che riceve il link, non collegato che risulta `da_email`, nessun secondo messaggio al giro successivo) e misurare in "Esecuzioni" la durata dei giri
- [ ] 1.5 Portinaio: su `chat_join_request` usare il collegamento o chiedere il numero via `user_chat_id`; sul contatto confrontare con gli iscritti e approvare, oppure lasciare `richiesta_in_attesa` con il motivo; verificare con il link condiviso da un numero iscritto (approvato e collegato) e da uno non iscritto (resta in attesa)
- [ ] 1.6 Verificare con grep che token, `chat_id` e numeri non compaiano nel repository

## 2. App

- [ ] 2.1 In `docs/js/config.js` aggiungere `telegramBot` (nome utente pubblico del bot); in `docs/js/clouddb.js` aggiungere le schede `Telegram`, `Gruppi_Telegram` e `Inviti_Telegram` a `TABS` e alla lettura iniziale, più le scritture dell'abbinamento e di "email inviata"; verificare con login che le schede vengano create e lette
- [ ] 2.2 In `docs/index.html` aggiungere nella scheda Escursioni la guida passo passo (nome suggerito con "Copia nome", passo del bot, abbinamento con conferma e possibilità di toglierlo, inviti in preparazione, email, tutto fatto) e l'avviso "Uscite senza gruppo Telegram"; verificare in `?demo=1` ogni passo, in tema chiaro e scuro e da telefono
- [ ] 2.3 Mostrare lo stato Telegram per iscritto e i totali, le richieste da decidere e la scheda socio "collegato a Telegram"; verificare in demo gli scenari delle specifiche
- [ ] 2.4 Aggiungere "Email con il link del gruppo" (CCN solo per `da_email` con email, elenco a parte "da contattare a mano", pulsante "Segna email inviata"); verificare in demo che l'email contenga solo gli indirizzi giusti
- [ ] 2.5 Simulazione in `docs/js/demo.js` (gruppo registrato, collegamenti e inviti finti); verificare con `?demo=1` che non parta nessuna chiamata a Google o a Telegram

## 3. Configurazione e documentazione

- [ ] 3.1 Aggiungere a `SETUP-APPS-SCRIPT.md` la sezione bot: creazione con BotFather (`/newbot`, `/setjoingroups`, descrizione e immagine), inserimento di `TELEGRAM_TOKEN` nelle proprietà dello script, nuova esecuzione di `installa()`, testo da aggiungere al messaggio di conferma del form template, nota sull'informativa privacy; verificare seguendo la guida con il bot vero
- [ ] 3.2 Aggiornare `README.md` (funzionalità e tabella "Dove finiscono i dati" con le tre nuove schede)

## 4. Rilascio

- [ ] 4.1 Aumentare la versione in `config.js`, `?v=` in `index.html` e `manifest.webmanifest`, cache in `sw.js`, note in `version.json`; verificare in `?demo=1` che l'app mostri la nuova versione
- [ ] 4.2 Dopo il push, prova completa con login su un'uscita di prova: guida fino a "tutto fatto", link personale ricevuto da un iscritto collegato, ingresso dal link dell'email di un iscritto non collegato, richiesta di un non iscritto lasciata in attesa; poi chiudere il gruppo di prova e cestinare form e foglio

## Workflow follow-up

- Implementare e archiviare prima `sintassi-fogli-iscrizioni` e `crea-form-escursione`, da cui questa change dipende.
- Archiviare questa change dopo la prova completa con i dati veri.
