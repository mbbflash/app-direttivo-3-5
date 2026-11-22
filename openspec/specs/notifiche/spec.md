# notifiche Specification

## Purpose
Avvisa il direttivo, mentre l'app è aperta (anche in background), delle nuove iscrizioni alle escursioni e delle nuove richieste di iscrizione all'associazione, senza server dedicati: le notifiche funzionano solo dentro l'app.

## Requirements

### Requirement: Attivazione con la campanella
Il sistema SHALL chiedere il permesso per le notifiche del browser solo quando l'utente preme la campanella e SHALL mostrarne lo stato (attive, bloccate, non supportate, da attivare).

#### Scenario: Notifiche già attive
- **WHEN** l'utente preme la campanella con le notifiche già consentite
- **THEN** il sistema invia una notifica di prova

#### Scenario: Notifiche bloccate
- **WHEN** il permesso è stato negato
- **THEN** il sistema spiega di riattivarle dalle impostazioni del sito

### Requirement: Controllo periodico dei fogli
Il sistema SHALL, con l'utente collegato e online, controllare ogni 3 minuti (e 5 secondi dopo l'avvio, al ritorno della connessione e quando l'app torna in primo piano dopo più di un minuto) quali fogli dei form e quale foglio iscrizioni sono cambiati, con una sola chiamata a Drive, e rileggere solo quelli modificati.

#### Scenario: Nessun foglio cambiato
- **WHEN** nessun foglio ha una data di modifica diversa dall'ultima volta
- **THEN** il sistema non legge nessun foglio

### Requirement: Avviso di nuove righe
Il sistema SHALL ricordare sul dispositivo quante righe aveva ogni foglio e avvisare quando ne trova di più, anche per le righe arrivate mentre l'app era chiusa, indicando fino a tre nomi e "e altri N".

#### Scenario: Nuova iscrizione a un'escursione
- **WHEN** il foglio di un form ha una riga in più dell'ultima volta
- **THEN** il sistema avvisa "Nuova iscrizione a <uscita>: <nome> (totale N)" con un messaggio nell'app e, se consentito, una notifica del browser
- **AND** aggiorna quell'uscita nella scheda Escursioni se è già caricata

#### Scenario: Nuova richiesta di iscrizione all'associazione
- **WHEN** il foglio "3 - Modulo Iscrizione Tre Quinti Trekking APS (Risposte)" ha una riga in più
- **THEN** il sistema avvisa "Nuovo socio: <nome> · <tipo di tessera>" leggendo solo le colonne F:J

#### Scenario: Primo controllo o form appena creato
- **WHEN** il sistema vede un foglio per la prima volta
- **THEN** memorizza il numero di righe senza avvisare

### Requirement: Avvisi non letti
Il sistema SHALL contare gli avvisi arrivati mentre l'app non è in primo piano, mostrandoli nel titolo della pagina e sul badge dell'icona dove supportato, e SHALL azzerarli quando l'app torna visibile. Il clic su una notifica SHALL riportare in primo piano l'app o aprirla.

#### Scenario: Due avvisi in background
- **WHEN** arrivano due avvisi mentre l'app è in un'altra scheda
- **THEN** il titolo diventa "(2) APP Direttivo 3/5 — Soci ed Escursioni"
