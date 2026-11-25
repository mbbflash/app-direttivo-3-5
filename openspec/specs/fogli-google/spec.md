# fogli-google Specification

## Purpose
Definisce come l'app trova e legge i Fogli Google dell'associazione senza mai tenere ID o URL nel codice pubblico: ricerca per nome nel Drive dell'account, cache degli ID sul dispositivo, conversione delle righe in record e gestione degli errori e dei limiti di richieste di Google.

## Requirements

### Requirement: Fogli trovati per nome
Il sistema SHALL individuare ogni foglio cercandolo per nome con la Drive API (nomi configurati in `config.js`) e MUST NOT contenere nel codice ID o URL dei fogli.

#### Scenario: Foglio trovato
- **WHEN** l'app cerca "2 - Libro Soci e Volontari" e nel Drive esiste un foglio con quel nome, non cestinato
- **THEN** il sistema usa quel file, preferendo quello di proprietà dell'account se ce ne sono più di uno
- **AND** salva l'ID nella cache del dispositivo per le volte successive

#### Scenario: Foglio non trovato
- **WHEN** nessun foglio ha il nome cercato
- **THEN** il sistema mostra "Foglio "…" non trovato nel Drive dell'account."

#### Scenario: Foglio ricreato o spostato
- **WHEN** la lettura con l'ID in cache fallisce per un motivo diverso dalla sessione scaduta
- **THEN** il sistema dimentica l'ID, ripete una volta la ricerca per nome e, se trova un ID diverso, riprova con quello

### Requirement: Fogli in sola lettura
Il sistema MUST NOT scrivere nel Libro Soci ("2 - Libro Soci e Volontari", scheda "Libro Soci", colonne A:AZ), nei fogli risposte delle escursioni ("Iscrizioni AAAA.MM.GG - …" oppure "Form Iscrizione AAAA.MM.GG - …", primo foglio, colonne A:AZ), nel foglio "3 - Modulo Iscrizione Tre Quinti Trekking APS (Risposte)", di cui SHALL leggere solo le colonne F:J, né nel foglio delle schede tecniche "Tre Quinti Trekking - Schede Tecniche Escursioni …", di cui SHALL leggere solo il primo foglio, colonne A:K.

#### Scenario: Libro Soci in sola lettura
- **WHEN** l'utente lavora sui soci (spunte, note, solleciti)
- **THEN** il sistema non scrive mai nel Libro Soci né nei fogli dei Form, ma solo nel database condiviso

#### Scenario: Schede tecniche in sola lettura
- **WHEN** l'utente usa l'assistente alla scelta della prossima escursione
- **THEN** il sistema legge le schede tecniche senza mai modificarle

### Requirement: Fogli in scrittura
Il sistema SHALL leggere e scrivere il foglio "NON TOCCARE - DATABASE APP DI GESTIONE" (database condiviso) e SHALL scrivere nel foglio "Tre Quinti Wrapped - Foglio Calcolo" (schede "DatiEscursioniAAAA") solo aggiungendo righe in fondo e dopo conferma dell'utente.

#### Scenario: Righe esistenti delle statistiche
- **WHEN** l'app aggiunge presenze al foglio statistiche
- **THEN** non modifica né cancella le righe già presenti

### Requirement: Righe trasformate in record
Il sistema SHALL usare la prima riga di ogni foglio come intestazioni, MUST ignorare le righe completamente vuote e SHALL ricordare per ogni record il numero di riga d'origine.

#### Scenario: Intestazione vuota
- **WHEN** una colonna non ha intestazione
- **THEN** il sistema la chiama `Colonna_N` (N = posizione)

### Requirement: Riprova automatica sui limiti di Google
Il sistema SHALL riprovare fino a 4 volte, con attesa crescente (da 2 a 16 secondi più un ritardo casuale), le richieste che ricevono HTTP 429 e le letture che ricevono 500, 502, 503 o 504, perché tutto il direttivo condivide lo stesso account e quindi lo stesso limite di richieste.

#### Scenario: Troppe richieste
- **WHEN** Google risponde 429 a una richiesta
- **THEN** il sistema attende e riprova senza mostrare errori, finché non riesce o esaurisce i tentativi

### Requirement: Messaggi di errore comprensibili
Il sistema SHALL tradurre gli errori di Google in messaggi in italiano che dicono cosa fare.

#### Scenario: API non abilitata
- **WHEN** Google segnala che la Drive API o la Sheets API non è abilitata nel progetto Cloud
- **THEN** il sistema indica quale API abilitare, rimanda a SETUP-GOOGLE.md e suggerisce di premere "Aggiorna dati" dopo un paio di minuti

#### Scenario: Accesso negato al foglio
- **WHEN** Google risponde 403 o 404
- **THEN** il messaggio invita a controllare che l'account abbia accesso al foglio
