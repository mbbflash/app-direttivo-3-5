# app-installabile Specification

## Purpose
Rende l'app installabile e sempre aggiornata su PC, Android, Chromebook e iPhone come PWA pubblicata su GitHub Pages, con funzionamento offline dell'interfaccia, avviso delle nuove versioni con le novità, tema chiaro/scuro e una procedura di rilascio che evita file vecchi in cache.

## Requirements

### Requirement: PWA installabile
Il sistema SHALL fornire un manifest con nome "APP Direttivo 3/5", nome breve "Direttivo 3/5", lingua italiana, visualizzazione standalone, colore del tema #730b2d e icone 192/512 px (anche maskable), così da potersi installare da Chrome, Edge e Safari.

#### Scenario: Installazione su Android
- **WHEN** l'utente apre l'app in Chrome su Android e sceglie "Installa app"
- **THEN** l'app compare con la sua icona e si apre a schermo intero

### Requirement: Service worker "prima la rete"
Il sistema SHALL servire i file dell'app dalla rete quando c'è connessione, salvandone una copia, e dalla copia salvata quando manca; MUST NOT mettere in cache i dati Google né richieste verso altri domini.

#### Scenario: Offline
- **WHEN** l'utente apre l'app senza connessione
- **THEN** si apre l'ultima versione salvata dell'interfaccia

#### Scenario: Nuova versione della cache
- **WHEN** viene attivato un service worker con un nome di cache nuovo
- **THEN** le cache precedenti vengono cancellate

### Requirement: Avviso di nuova versione
Il sistema SHALL controllare `version.json` 4 secondi dopo l'apertura, ogni 30 minuti e al ritorno in primo piano dopo più di 10 minuti, e se la versione pubblicata è più recente di quella in uso SHALL mostrare un riquadro con le novità e il pulsante "Aggiorna ora"; con le notifiche attive SHALL inviare una notifica una sola volta per versione.

#### Scenario: Versione più recente pubblicata
- **WHEN** l'app in uso è la 2.3.0 e `version.json` indica 2.4.0
- **THEN** compare "È disponibile la versione 2.4.0" con le note delle versioni successive alla 2.3.0

### Requirement: Novità dopo l'aggiornamento
Il sistema SHALL mostrare una sola volta, dopo un aggiornamento, il riquadro "Novità della versione X" con le note delle versioni comprese tra quella vista l'ultima volta e quella attuale.

#### Scenario: Primo avvio dopo l'aggiornamento
- **WHEN** l'utente apre la 2.4.0 dopo aver usato la 2.3.0
- **THEN** vede le novità della 2.4.0, e alla riapertura successiva non le vede più

### Requirement: Tema e marchio
Il sistema SHALL usare logo e colori Tre Quinti Trekking (bordeaux #730B2D) e offrire il tema chiaro, scuro o automatico, ricordando la scelta sul dispositivo.

#### Scenario: Tema automatico
- **WHEN** il tema è "automatico" e il sistema operativo è in modalità scura
- **THEN** l'app usa il tema scuro

### Requirement: Procedura di rilascio
Ogni rilascio MUST aumentare `version` in `docs/js/config.js`, aggiornare il parametro `?v=` di script e icone in `docs/index.html` e `docs/manifest.webmanifest`, cambiare il nome della cache in `docs/sw.js` e aggiungere la versione con le note in `docs/version.json`. Il push su `main` della cartella `docs/` pubblica l'app su GitHub Pages.

#### Scenario: Rilascio dimenticando version.json
- **WHEN** si pubblica una nuova versione senza aggiornare `version.json`
- **THEN** nessuno riceve l'avviso di aggiornamento: per questo il passo è obbligatorio
