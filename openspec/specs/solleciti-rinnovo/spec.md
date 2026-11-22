# solleciti-rinnovo Specification

## Purpose
Aiuta il direttivo a ricordare ai soci di rinnovare la tessera, singolarmente o in gruppo, con messaggi già pronti, e registra ogni sollecito nel database condiviso così che nessuno venga contattato due volte.

## Requirements

### Requirement: Soci da sollecitare
Il sistema SHALL considerare "da sollecitare" un socio IN_SCADENZA o SCADUTA che non ha solleciti registrati, oppure il cui ultimo sollecito risale a 14 giorni fa o più.

#### Scenario: Sollecitato 5 giorni fa
- **WHEN** un socio scaduto è stato sollecitato 5 giorni fa
- **THEN** non compare nel filtro "Da sollecitare"

#### Scenario: Sollecitato 20 giorni fa
- **WHEN** un socio in scadenza è stato sollecitato 20 giorni fa
- **THEN** compare nel filtro "Da sollecitare"

### Requirement: Messaggio di sollecito già pronto
Il sistema SHALL proporre nella scheda socio un messaggio con il nome di battesimo, il n° tessera e la scadenza ("è scaduta il…", "scade oggi", "scade domani" o "scadrà il … (tra N giorni)"), modificabile prima dell'invio. Il pannello SHALL essere aperto di default per i soci in scadenza o scaduti.

#### Scenario: Tessera che scade domani
- **WHEN** l'utente apre la scheda di un socio la cui tessera scade domani
- **THEN** il messaggio dice "la tua tessera n° … scade domani"

### Requirement: Canali di invio
Il sistema SHALL offrire l'invio con WhatsApp (testo precompilato), Telegram (testo copiato negli appunti e chat aperta, perché Telegram non permette di precompilarlo), Email (programma di posta con oggetto "Rinnovo tessera Tre Quinti Trekking APS"), "Copia testo" e "Segna come sollecitato" per i solleciti fatti a voce.

#### Scenario: Invio con WhatsApp
- **WHEN** l'utente preme "Invia su WhatsApp"
- **THEN** si apre WhatsApp con il testo e il sollecito viene registrato con canale whatsapp

#### Scenario: Solo copia
- **WHEN** l'utente preme "Copia testo"
- **THEN** il testo va negli appunti ma il sollecito NON viene registrato

### Requirement: Registrazione condivisa dei solleciti
Il sistema SHALL salvare ogni sollecito nel database condiviso (scheda `Solleciti`) con canale, data (gg/mm/aaaa) e autore, e SHALL mostrare l'ultimo sollecito nella scheda socio e nella colonna "solleciti" della tabella.

#### Scenario: Ultimo sollecito visibile
- **WHEN** un socio è stato sollecitato via email da un altro membro del direttivo
- **THEN** la scheda mostra "Ultimo sollecito: <data> via Email da <nome>"

### Requirement: Sollecito di gruppo via email
Il sistema SHALL mostrare, quando il filtro per stato è In scadenza, Scadute o Da sollecitare, il pulsante "Sollecita rinnovo via email (N)" che apre il programma di posta con tutti gli indirizzi dei soci filtrati in CCN (senza duplicati) e un testo già pronto. Dopo l'invio SHALL chiedere conferma prima di registrare i solleciti.

#### Scenario: Troppi indirizzi per un link
- **WHEN** l'elenco degli indirizzi supera circa 1500 caratteri
- **THEN** il sistema copia gli indirizzi negli appunti, apre la posta senza destinatari e invita a incollarli in CCN

#### Scenario: Conferma dell'invio
- **WHEN** l'utente conferma di aver inviato l'email di gruppo
- **THEN** il sistema registra un sollecito con canale email per ciascun socio dell'elenco
