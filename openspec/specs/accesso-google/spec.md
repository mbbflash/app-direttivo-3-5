# accesso-google Specification

## Purpose
Controlla chi può usare l'app: accesso con Google limitato agli account abilitati, gestione della sessione (token di circa un'ora), uscita con pulizia dei dati dal dispositivo e modalità demo senza Google. È la base della sicurezza: il codice è pubblico, i dati si vedono solo dopo il login con un account che ha accesso ai fogli.

## Requirements

### Requirement: Accesso con Google tramite token client
Il sistema SHALL autenticare l'utente con Google Identity Services (token client OAuth) chiedendo gli scope `openid`, `email`, `spreadsheets` e `drive.metadata.readonly`, e MUST avviare la finestra di accesso solo in risposta a un clic dell'utente.

#### Scenario: Accesso riuscito
- **WHEN** l'utente preme "Accedi con Google" e concede tutti i permessi con un account abilitato
- **THEN** il sistema salva il token sul dispositivo con la sua scadenza e l'email dell'account
- **AND** carica il Libro Soci e il database condiviso e avvia il controllo delle notifiche

#### Scenario: Permessi concessi solo in parte
- **WHEN** l'utente non concede `spreadsheets` o `drive.metadata.readonly`
- **THEN** il sistema rifiuta l'accesso e chiede di riprovare spuntando tutte le caselle

#### Scenario: Finestra di accesso bloccata o chiusa
- **WHEN** il browser blocca il popup o l'utente lo chiude
- **THEN** il sistema mostra un messaggio specifico ("consenti i popup" oppure "Accesso annullato") e resta sulla schermata di accesso

### Requirement: Solo account abilitati
Il sistema SHALL consentire l'accesso solo agli account elencati in `allowedAccounts` di `config.js` (oggi `trequintitrekking@gmail.com`), confrontando l'email senza distinzione tra maiuscole e minuscole.

#### Scenario: Account non abilitato
- **WHEN** l'utente accede con un account Google non presente in `allowedAccounts`
- **THEN** il sistema revoca subito il token e mostra "Questo account (…) non è abilitato. Accedi con …"

### Requirement: Durata e scadenza della sessione
Il sistema SHALL considerare valida la sessione solo finché mancano più di 60 secondi alla scadenza del token e MUST trattare una risposta HTTP 401 di Google come sessione scaduta.

#### Scenario: Riapertura con token ancora valido
- **WHEN** l'utente riapre l'app e il token salvato è ancora valido
- **THEN** il sistema entra senza chiedere di nuovo l'accesso e carica i dati

#### Scenario: Sessione scaduta durante l'uso
- **WHEN** una chiamata a Google trova il token scaduto o riceve 401
- **THEN** il sistema cancella il token e mostra la schermata di accesso con "Sessione Google scaduta: accedi di nuovo."
- **AND** le modifiche non ancora salvate restano in coda sul dispositivo

### Requirement: Uscita con pulizia del dispositivo
Il sistema SHALL, all'uscita, revocare il token e cancellare dal dispositivo i dati dei soci in cache, le spunte, le note, i solleciti, la coda delle modifiche e lo stato delle notifiche, chiedendo conferma prima.

#### Scenario: Uscita con modifiche in coda
- **WHEN** l'utente preme "Esci" e ci sono modifiche non ancora salvate nel database
- **THEN** il sistema avverte che andranno perse e esce solo se l'utente conferma

#### Scenario: Uscita senza modifiche in coda
- **WHEN** l'utente preme "Esci" e conferma
- **THEN** il sistema revoca il token, cancella i dati in cache e ricarica la pagina sulla schermata di accesso

### Requirement: App non configurata
Il sistema SHALL bloccare l'accesso e spiegare cosa fare quando in `config.js` manca il Client ID Google.

#### Scenario: Client ID mancante
- **WHEN** `googleClientId` è vuoto o è ancora il segnaposto "INSERISCI…"
- **THEN** il pulsante di accesso è disabilitato e il messaggio rimanda a SETUP-GOOGLE.md e alla modalità `?demo=1`

### Requirement: Modalità demo
Il sistema SHALL offrire, con il parametro `?demo=1` nell'indirizzo, una modalità con dati inventati che non contatta Google e MUST tenere i dati demo separati da quelli veri (memoria di sessione con prefisso dedicato).

#### Scenario: Apertura in demo
- **WHEN** l'utente apre l'app con `?demo=1`
- **THEN** l'accesso usa un token finto, tutte le chiamate a Drive e Sheets sono servite da dati inventati e accanto alla versione compare "DEMO"
- **AND** niente viene scritto nel database condiviso vero né nella memoria locale usata dalla versione normale

#### Scenario: Residui di vecchie versioni demo
- **WHEN** l'app si apre in modalità normale e trova nella memoria locale un token o ID di file demo
- **THEN** il sistema cancella quei residui prima di usare la memoria
