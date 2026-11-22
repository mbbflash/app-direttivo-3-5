## Why

Il direttivo sceglie la prossima escursione "a memoria": quali percorsi non si fanno da tanto, quali sono adatti alla stagione, quali hanno avuto più partecipanti. Le schede tecniche di tutte le uscite 2024-2026 esistono già in un foglio Google, ma non sono collegate alle presenze e alle iscrizioni che l'app già legge. Un assistente che incrocia questi dati aiuta a scegliere in pochi secondi e a preparare l'annuncio.

## What Changes

- Nuova scheda **Prossima uscita** con l'assistente alla scelta della prossima escursione.
- Lettura (solo lettura) del foglio delle schede tecniche, trovato per nome con il prefisso "Tre Quinti Trekking - Schede Tecniche Escursioni" (il nome contiene gli anni e può cambiare).
- Filtri: data prevista, difficoltà massima, dislivello massimo, durata massima, punto di ritrovo, esclusione dei percorsi fatti di recente.
- Punteggio e classifica dei percorsi con le motivazioni: adatto alla stagione (quota), tempo dall'ultima volta, partecipazione media, varietà rispetto alle ultime uscite. I percorsi già in programma (form futuro) vengono segnalati ed esclusi.
- Per ogni proposta: dati tecnici, ritrovo, descrizione e pulsante **Copia annuncio** (testo pronto per Telegram/WhatsApp/email).
- Dati demo (?demo=1) con schede tecniche inventate.

Fogli Google:
- letto: "Tre Quinti Trekking - Schede Tecniche Escursioni …" (primo foglio, colonne A:K) — NUOVO, sola lettura;
- letti come già oggi: "Tre Quinti Wrapped - Foglio Calcolo" e i fogli "Form Iscrizione …" (per date e presenze);
- nessuna scrittura; lo schema del database condiviso NON cambia.

Fuori da questa modifica:
- nessuna intelligenza artificiale esterna (niente chiavi API nel browser): il punteggio è calcolato con regole trasparenti;
- nessuna creazione automatica del Google Form o dell'evento;
- nessun meteo in tempo reale;
- nessuna modifica del foglio delle schede tecniche.

## Capabilities

### New Capabilities
- `assistente-escursioni`: suggerisce la prossima escursione incrociando schede tecniche, presenze e iscrizioni.

### Modified Capabilities
- `fogli-google`: il foglio delle schede tecniche si aggiunge ai fogli in sola lettura.

## Impact

- `docs/js/config.js` (nuovo prefisso), `docs/js/google.js` (`AppData.loadSchede`), `docs/js/demo.js` (foglio demo), `docs/index.html` (scheda, stile, logica), `docs/js/app.js` (Aggiorna dati).
- Una chiamata Drive + una Sheets all'apertura della scheda: impatto trascurabile sul limite di richieste condiviso.
