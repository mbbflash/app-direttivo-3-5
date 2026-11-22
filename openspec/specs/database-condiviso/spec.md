# database-condiviso Specification

## Purpose
Permette al direttivo di condividere spunte delle tessere cartacee, note sui soci, conferme e note sulle escursioni e solleciti di rinnovo, usando come database il foglio "NON TOCCARE - DATABASE APP DI GESTIONE". Le modifiche si salvano subito sul dispositivo e partono verso il foglio appena possibile, anche dopo un periodo offline o con la sessione scaduta, con lo storico di chi ha fatto cosa.

## Requirements

### Requirement: Schema del database
Il sistema SHALL usare nel foglio database le schede `Tessere`, `Note`, `Conferme_Escursioni`, `Solleciti` e `Log`, con colonne fisse, e MUST crearle con l'intestazione (riga 1 bloccata) se mancano.

#### Scenario: Colonne delle schede
- **WHEN** l'app legge o scrive il database
- **THEN** usa queste colonne, nell'ordine:
  - `Tessere`: chiave, tessera, socio, preparata, consegnata, aggiornato_il, aggiornato_da
  - `Note`: chiave, tessera, socio, nota, aggiornato_il, aggiornato_da
  - `Conferme_Escursioni`: chiave, escursione, partecipante, confermato, nota, aggiornato_il, aggiornato_da
  - `Solleciti`: chiave, tessera, socio, canale, data_sollecito, aggiornato_il, aggiornato_da
  - `Log`: quando, chi, tipo, chiave, valore

#### Scenario: Database nuovo o incompleto
- **WHEN** l'app apre il database e una delle schede non esiste
- **THEN** il sistema la crea con le intestazioni previste prima di leggere o scrivere

### Requirement: Chiavi dei record
Il sistema SHALL identificare un socio con `tessera_<n° tessera>`, oppure `cf_<codice fiscale>` se manca la tessera, oppure `<COGNOME>_<NOME>_<posizione>` se mancano entrambi; e un partecipante a un'escursione con `<id foglio form>::<chiave persona>`.

#### Scenario: Socio con numero di tessera
- **WHEN** un socio ha "TESSERA n°" = 123
- **THEN** le sue spunte, note e solleciti usano la chiave `tessera_123`

### Requirement: Lettura del database
Il sistema SHALL leggere le schede Tessere, Note, Conferme_Escursioni e Solleciti in un'unica richiesta e, se la stessa chiave compare su più righe, MUST considerare valida l'ultima. Le modifiche locali ancora in coda SHALL essere applicate sopra i dati letti.

#### Scenario: Valori sì/no
- **WHEN** una cella vale SI, SÌ, TRUE, VERO, 1 o X (senza distinzione di maiuscole)
- **THEN** il sistema la interpreta come "sì"; qualunque altro valore come "no"

#### Scenario: Consegnata implica preparata
- **WHEN** una riga di `Tessere` ha consegnata = SI e preparata = NO
- **THEN** il sistema considera la tessera sia preparata sia consegnata

#### Scenario: Ritorno sull'app
- **WHEN** l'app torna in primo piano e sono passati più di 60 secondi dall'ultima lettura
- **THEN** il sistema rilegge il database per mostrare le modifiche fatte dagli altri

### Requirement: Coda delle modifiche sul dispositivo
Il sistema SHALL salvare ogni modifica prima in una coda sul dispositivo, tenendo per ogni chiave solo l'ultima versione, e poi inviarla al foglio dopo un breve ritardo (circa 0,3 secondi per spunte e solleciti, 1 secondo per note e conferme).

#### Scenario: Salvataggio riuscito
- **WHEN** una modifica in coda viene scritta nel foglio
- **THEN** il sistema aggiorna la riga esistente con quella chiave o, se non c'è, ne aggiunge una nuova
- **AND** aggiunge una riga nella scheda `Log`
- **AND** toglie la modifica dalla coda solo se nel frattempo non ne è arrivata una più recente per la stessa chiave

#### Scenario: Chiave creata da un altro dispositivo
- **WHEN** il sistema deve scrivere una chiave che non conosce
- **THEN** rilegge la colonna delle chiavi e, se un altro dispositivo l'ha appena creata, aggiorna quella riga invece di duplicarla

#### Scenario: Offline
- **WHEN** il dispositivo è offline
- **THEN** le modifiche restano in coda, l'indicatore mostra "⚠ Offline: N modifiche in attesa" e il salvataggio riparte quando torna la connessione

#### Scenario: Sessione scaduta con modifiche in coda
- **WHEN** ci sono modifiche in coda e la sessione Google è scaduta
- **THEN** l'indicatore mostra "accedi per salvare"; dopo il nuovo accesso le modifiche vengono salvate

#### Scenario: Errore di scrittura
- **WHEN** la scrittura fallisce per un motivo diverso dalla sessione scaduta
- **THEN** il sistema mostra "⚠ Errore di salvataggio: riprovo" e ritenta dopo 15 secondi

### Requirement: Indicatore di sincronizzazione
Il sistema SHALL mostrare lo stato del database (salvato, lettura, salvataggio, N modifiche da salvare, accedi per salvare, offline, errore di salvataggio, database non raggiungibile), e un clic sull'indicatore SHALL avviare l'azione adatta (accedere, riprovare il salvataggio o rileggere).

#### Scenario: Database non raggiungibile
- **WHEN** la lettura del database fallisce
- **THEN** l'indicatore mostra "⚠ Database non raggiungibile: clic per riprovare" e il clic rilegge tutti i dati

### Requirement: Chi ha fatto la modifica
Il sistema SHALL registrare in `aggiornato_il` data e ora italiane e in `aggiornato_da` il nome scritto nel campo "Il tuo nome" seguito dall'email dell'account (o solo l'email se il nome manca).

#### Scenario: Nome operatore impostato
- **WHEN** l'utente ha scritto "Anna" in "Il tuo nome" e salva una nota
- **THEN** la riga riporta `aggiornato_da` = "Anna (trequintitrekking@gmail.com)" e lo stesso valore finisce nel `Log`

### Requirement: Ridisegno senza disturbare chi scrive
Il sistema SHALL rimandare il ridisegno della pagina dopo una lettura del database finché l'utente sta scrivendo in un campo della tabella soci, della scheda socio o delle righe di un'escursione.

#### Scenario: Aggiornamento mentre si scrive una nota
- **WHEN** arrivano dati nuovi dal database mentre il cursore è in un campo nota
- **THEN** il sistema ridisegna solo quando il campo perde il focus

### Requirement: Migrazione dei dati della versione precedente
Il sistema SHALL, una sola volta per dispositivo, proporre di caricare nel database condiviso le spunte, le note e le conferme salvate solo localmente dalla versione precedente dell'app, se non sono già presenti nel database.

#### Scenario: Dati locali vecchi presenti
- **WHEN** al primo caricamento del database il dispositivo ha dati locali assenti dal database
- **THEN** il sistema mostra quanti sono per tipo e li carica solo se l'utente conferma; in ogni caso non lo chiede più su quel dispositivo
