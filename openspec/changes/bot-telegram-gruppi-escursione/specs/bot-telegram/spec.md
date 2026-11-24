## Purpose

Il bot Telegram dell'associazione collega gli iscritti al loro utente Telegram tramite il numero di telefono. Manda i link d'invito ai gruppi delle uscite e ammette nei gruppi solo chi risulta iscritto. Gira nello script Apps Script dell'associazione, senza costi.

## ADDED Requirements

### Requirement: Primo contatto con condivisione del numero
Quando una persona scrive al bot in privato e non è ancora collegata, il bot SHALL chiederle di condividere il proprio numero con un pulsante dedicato, e MUST NOT fare altro finché non l'ha condiviso. Il bot SHALL accettare solo il contatto della persona stessa (l'utente del contatto coincide con chi scrive).

#### Scenario: Prima volta
- **WHEN** una persona mai vista scrive "/start" al bot
- **THEN** il bot risponde chiedendo di condividere il numero, con il pulsante "Condividi il mio numero"

#### Scenario: Contatto di un'altra persona
- **WHEN** una persona inoltra al bot il contatto di qualcun altro
- **THEN** il bot non salva nulla e chiede di condividere il proprio numero

#### Scenario: Numero condiviso
- **WHEN** la persona condivide il proprio contatto
- **THEN** il bot salva il collegamento numero ↔ utente Telegram e conferma che riceverà i link dei gruppi delle uscite a cui si iscrive

### Requirement: Collegamento numero e utente Telegram
Il bot SHALL salvare per ogni persona collegata il numero normalizzato (solo cifre, senza prefisso 39 se il numero ha più di 10 cifre), l'identificativo dell'utente Telegram, il nome mostrato su Telegram, la data e lo stato (attivo o stop). Se lo stesso numero si ricollega con un altro utente, SHALL valere l'ultimo collegamento.

#### Scenario: Numero con prefisso
- **WHEN** una persona condivide "+39 333 1234567"
- **THEN** il numero salvato è "3331234567"

### Requirement: Comandi stop e start
Il comando "/stop" SHALL mettere il collegamento in stato stop: da quel momento il bot MUST NOT mandare link a quella persona. Il comando "/start" di una persona già collegata SHALL riportarla allo stato attivo.

#### Scenario: Persona che non vuole messaggi
- **WHEN** una persona collegata scrive "/stop"
- **THEN** il bot conferma e non le manda più link; per le uscite successive risulta "da mandare via email"

### Requirement: Registrazione dei gruppi
Quando il bot viene aggiunto a un gruppo o nominato amministratore, SHALL registrare il gruppo (identificativo, nome, data, se il bot è amministratore) tra i gruppi da abbinare. Se il bot non è amministratore, SHALL scrivere nel gruppo che va nominato amministratore per poter invitare.

#### Scenario: Bot aggiunto senza permessi
- **WHEN** il bot viene aggiunto a un gruppo come membro semplice
- **THEN** il gruppo compare tra quelli da abbinare con l'indicazione "bot non amministratore"
- **AND** il bot scrive nel gruppo che serve nominarlo amministratore con il permesso di invitare utenti

### Requirement: Inviti agli iscritti collegati
Per ogni uscita abbinata a un gruppo e non ancora passata, il bot SHALL controllare almeno ogni 10 minuti gli iscritti nel foglio risposte. A ogni iscritto il cui numero è collegato e attivo, e che non ha ancora ricevuto l'invito, SHALL mandare in privato un link personale al gruppo, valido per una sola persona. SHALL segnare tutti gli altri come "da mandare via email".

#### Scenario: Iscritto collegato
- **WHEN** un iscritto all'uscita ha un numero collegato e attivo
- **THEN** riceve dal bot un messaggio con il nome dell'uscita e un link valido per una sola persona
- **AND** il suo stato diventa "inviato su Telegram"

#### Scenario: Iscritto non collegato
- **WHEN** un iscritto non ha un numero collegato, oppure è in stato stop
- **THEN** il bot non gli scrive e il suo stato diventa "da mandare via email"

#### Scenario: Iscritto arrivato dopo
- **WHEN** una persona collegata si iscrive all'uscita dopo che gli inviti sono già partiti
- **THEN** riceve il link al controllo successivo, senza intervento del direttivo

#### Scenario: Messaggio non consegnabile
- **WHEN** Telegram rifiuta il messaggio privato (per esempio perché la persona ha bloccato il bot)
- **THEN** il bot segna l'iscritto "da mandare via email" e il collegamento in stato stop

### Requirement: Portinaio delle richieste di accesso
Il link condiviso dell'uscita SHALL richiedere l'approvazione per entrare. Quando arriva una richiesta di accesso, il bot SHALL controllare il numero della persona: se è collegata usa quel numero, altrimenti le scrive in privato chiedendo di condividerlo. Se il numero è tra gli iscritti dell'uscita, SHALL approvare la richiesta, collegare il numero se nuovo e segnare l'iscritto "entrato". Altrimenti la richiesta MUST restare in attesa e SHALL essere segnalata al direttivo.

#### Scenario: Iscritto dal link dell'email
- **WHEN** un iscritto non collegato chiede di entrare con il link condiviso e condivide il proprio numero, presente nel foglio dell'uscita
- **THEN** il bot approva la richiesta e lo collega per le uscite successive

#### Scenario: Persona non iscritta
- **WHEN** chiede di entrare una persona il cui numero non è nel foglio dell'uscita
- **THEN** la richiesta resta in attesa in Telegram e l'app la mostra tra quelle da decidere

#### Scenario: Numero non condiviso
- **WHEN** la persona che ha chiesto di entrare non condivide il numero
- **THEN** la richiesta resta in attesa e l'app la mostra tra quelle da decidere

### Requirement: Token e chiamate a Telegram
Il token del bot SHALL stare solo nelle proprietà dello script, MUST NOT comparire nel repository né nel foglio database, e le chiamate a Telegram SHALL partire solo dallo script, mai dal browser.

#### Scenario: Controllo del repository
- **WHEN** si cerca il token nel repository e nel foglio database
- **THEN** non compare da nessuna parte
