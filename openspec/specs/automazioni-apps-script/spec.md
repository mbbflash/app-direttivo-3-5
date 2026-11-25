# automazioni-apps-script Specification

## Purpose

Esegue sull'account Google dell'associazione le operazioni che l'app nel browser non può fare da sola. L'app le chiede tramite richieste scritte nel database condiviso, e lo script ne registra stato e risultato.

## Requirements

### Requirement: Richieste nel database condiviso
L'app SHALL chiedere un'operazione allo script aggiungendo una riga alla scheda `Richieste` del database condiviso, con stato `in_attesa`, il tipo di operazione, i parametri e chi l'ha chiesta. L'app MUST NOT chiamare lo script in altri modi.

#### Scenario: Nuova richiesta
- **WHEN** un membro del direttivo avvia un'operazione che richiede lo script
- **THEN** nella scheda `Richieste` compare una nuova riga con un identificativo unico, stato `in_attesa`, tipo, parametri, data e ora e `creato_da` come per le altre modifiche

### Requirement: Esecuzione delle richieste
Lo script SHALL controllare la scheda `Richieste` almeno una volta al minuto e SHALL eseguire le righe `in_attesa` in ordine di creazione. Prima di eseguire una richiesta SHALL segnarla `in_corso`, e MUST NOT eseguire la stessa richiesta due volte, nemmeno se due esecuzioni dello script si sovrappongono.

#### Scenario: Richiesta presa in carico
- **WHEN** lo script trova una riga `in_attesa`
- **THEN** la segna `in_corso`, la esegue e alla fine la segna `fatto` con il risultato e l'ora di completamento

#### Scenario: Esecuzioni sovrapposte
- **WHEN** un'esecuzione dello script parte mentre la precedente sta ancora lavorando
- **THEN** la nuova non riprende le richieste già `in_corso`

### Requirement: Errori delle richieste
Se un'operazione fallisce, lo script SHALL segnare la richiesta `errore` con un messaggio in italiano che spiega cosa fare. Una richiesta rimasta `in_corso` per più di 10 minuti SHALL essere segnata `errore` con l'indicazione che l'esecuzione si è interrotta.

#### Scenario: Operazione fallita
- **WHEN** l'operazione richiesta non riesce
- **THEN** la riga passa a `errore` e la colonna errore contiene un messaggio comprensibile

#### Scenario: Esecuzione interrotta
- **WHEN** una richiesta è `in_corso` da più di 10 minuti
- **THEN** lo script la segna `errore` con il messaggio "Esecuzione interrotta: riprova"

### Requirement: Nessun segreto nel repository
Il codice dello script SHALL stare nel repository pubblico senza ID di file, URL privati o token. Lo script SHALL trovare i file per nome e SHALL tenere eventuali segreti solo nelle proprietà dello script.

#### Scenario: Controllo del codice
- **WHEN** si legge il codice dello script nel repository
- **THEN** non contiene ID di fogli o form, URL privati né token

### Requirement: Stato della richiesta nell'app
Dopo aver inviato una richiesta, l'app SHALL mostrarne lo stato (in attesa, in corso, fatto, errore) ricontrollandolo ogni 10 secondi. Se dopo 5 minuti la richiesta è ancora in attesa, l'app SHALL smettere di controllare e avvisare che lo script potrebbe non essere attivo, rimandando alla guida di installazione.

#### Scenario: Script non attivo
- **WHEN** una richiesta resta `in_attesa` per 5 minuti
- **THEN** l'app mostra "Lo script di automazione non ha risposto: controlla che sia installato e attivo" e smette di ricontrollare
