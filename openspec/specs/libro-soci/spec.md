# libro-soci Specification

## Purpose
Mostra al direttivo il Libro Soci letto dal Foglio Google, con lo stato di ogni tessera, ricerca, filtri, ordinamento e cruscotto, la scheda personale del socio, la gestione delle tessere cartacee e delle note condivise, e l'import/export CSV.

## Requirements

### Requirement: Caricamento del Libro Soci
Il sistema SHALL leggere la scheda "Libro Soci" del foglio "2 - Libro Soci e Volontari" dopo l'accesso e a ogni pressione di "Aggiorna dati", e SHALL tenerne una copia sul dispositivo per mostrarla subito alla riapertura.

#### Scenario: Aggiorna dati
- **WHEN** l'utente collegato preme "Aggiorna dati"
- **THEN** il sistema rilegge il Libro Soci, il database condiviso e, se già caricati, le escursioni e le statistiche

#### Scenario: Aggiorna dati senza sessione
- **WHEN** l'utente preme "Aggiorna dati" senza essere collegato
- **THEN** il sistema mostra la schermata di accesso

### Requirement: Stato della tessera
Il sistema SHALL calcolare i giorni alla scadenza da "DATA SCADENZA" (formato gg/mm/aaaa, confronto a mezzanotte) e assegnare a ogni socio uno stato:
- SCADUTA se "STATO TESSERA" contiene "SCADUT" oppure la scadenza è passata;
- IN_SCADENZA se mancano da 0 a 30 giorni;
- ATTIVA negli altri casi.

#### Scenario: Scadenza tra 10 giorni
- **WHEN** la data di scadenza è tra 10 giorni e lo stato nel foglio non contiene "SCADUT"
- **THEN** il socio risulta IN_SCADENZA con badge arancione e 10 nella colonna GG

#### Scenario: Scadenza passata
- **WHEN** la data di scadenza è ieri
- **THEN** il socio risulta SCADUTA con badge rosso, anche se il foglio dice "Attiva"

### Requirement: Cruscotto
Il sistema SHALL mostrare i contatori dei record totali, delle tessere attive, in scadenza (≤ 30 giorni) e scadute, e un clic su Attive, In scadenza o Scadute SHALL filtrare subito l'elenco.

#### Scenario: Clic sul contatore Scadute
- **WHEN** l'utente clicca il contatore "Scadute"
- **THEN** il filtro per stato passa a "Scadute" e la tabella mostra solo quei soci

### Requirement: Ricerca e filtri
Il sistema SHALL permettere di cercare per nome, cognome, n° tessera, email, telefono, codice fiscale o città, e di filtrare per tipologia di tessera (elenco creato dai dati), per stato (Non scadute, Solo attive, In scadenza, Scadute, Da sollecitare, Tutti) e per tessera cartacea (Da preparare, Preparata da consegnare, Consegnata). "Reset filtri" SHALL riportare tutto alla situazione iniziale.

#### Scenario: Ricerca per telefono
- **WHEN** l'utente scrive parte di un numero di telefono nella ricerca
- **THEN** la tabella mostra solo i soci il cui telefono lo contiene

#### Scenario: Scorciatoia di ricerca
- **WHEN** l'utente preme "/" fuori da un campo di testo
- **THEN** il cursore va nella casella di ricerca

### Requirement: Tabella ordinabile e adatta al telefono
Il sistema SHALL mostrare le colonne tessera, socio, tessera cartacea, tesseramento, scadenza, GG, stato, solleciti, note, nota e tipo tessera, ordinabili con un clic sull'intestazione, e su schermi stretti SHALL mostrare ogni socio come scheda senza scorrimento orizzontale.

#### Scenario: Ordinamento per scadenza
- **WHEN** l'utente clicca due volte sull'intestazione "Scadenza"
- **THEN** l'ordine passa da crescente a decrescente per data

### Requirement: Scheda socio
Il sistema SHALL aprire, al clic su un nominativo, una scheda con tutti i dati del socio presenti nel Libro Soci, i pulsanti Chiama, WhatsApp, Telegram ed Email (quando c'è il contatto), il curriculum escursioni, le spunte della tessera cartacea, la nota condivisa e il pannello "Sollecita rinnovo". Esc SHALL chiudere la scheda.

#### Scenario: Numero di telefono italiano
- **WHEN** il socio ha un cellulare di 10 cifre che inizia con 3, senza prefisso internazionale
- **THEN** i collegamenti WhatsApp e Telegram usano il numero con prefisso 39

#### Scenario: Numero non utilizzabile
- **WHEN** il numero, tolti spazi e simboli, ha meno di 8 cifre
- **THEN** i pulsanti WhatsApp e Telegram non vengono mostrati

### Requirement: Tessera cartacea condivisa
Il sistema SHALL permettere di segnare per ogni socio la tessera cartacea come "Preparata" e "Consegnata", salvando le spunte nel database condiviso (scheda `Tessere`); segnare "Consegnata" SHALL segnare anche "Preparata".

#### Scenario: Spunta consegnata
- **WHEN** un membro del direttivo spunta "Consegnata" per un socio
- **THEN** la spunta si salva nel database e gli altri la vedono al prossimo caricamento

### Requirement: Nota condivisa sul socio
Il sistema SHALL permettere una nota libera per socio, salvata nel database condiviso (scheda `Note`); una nota svuotata SHALL essere salvata come cancellata.

#### Scenario: Nota inclusa nell'export
- **WHEN** un socio ha una nota ed esporto l'elenco in CSV
- **THEN** il CSV contiene la nota del socio

### Requirement: Export CSV
Il sistema SHALL esportare in CSV l'elenco soci filtrato, comprese spunte e note.

#### Scenario: Export
- **WHEN** l'utente preme "Esporta CSV"
- **THEN** il sistema scarica un file con i soci attualmente filtrati e le colonne delle spunte e delle note
