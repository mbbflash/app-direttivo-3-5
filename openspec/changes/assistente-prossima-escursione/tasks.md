# Tasks

## 1. Dati

- [x] 1.1 Aggiungere `schedeNamePrefix` in `docs/js/config.js` e `AppData.loadSchede()` in `docs/js/google.js` (ricerca per prefisso, primo foglio A:K); verificare in demo che restituisca le righe
- [x] 1.2 Aggiungere un foglio demo di schede tecniche inventate in `docs/js/demo.js`, con nomi che coincidono con le uscite demo di statistiche e form; verificare con `?demo=1`

## 2. Assistente

- [x] 2.1 Aggiungere la scheda "Prossima uscita" (pulsante, vista, stile chiaro/scuro, telefono) in `docs/index.html`; verificare che si apra e carichi i dati
- [x] 2.2 Implementare parsing, unificazione dei percorsi, abbinamento a presenze/form, filtri e punteggio con motivazioni; verificare in demo che una quota alta a gennaio sia penalizzata e che l'uscita con form futuro risulti "già in programma"
- [x] 2.3 Implementare "Copia annuncio" e l'elenco completo dei percorsi con i motivi di esclusione; verificare la copia in demo
- [x] 2.4 Far rileggere le schede con "Aggiorna dati" (`docs/js/app.js`); verificare che il pulsante ricarichi anche le schede
- [x] 2.5 Documentare la funzione nel README (sezione Funzionalità e tabella "Dove finiscono i dati")

## 3. Rilascio

- [x] 3.1 Portare la versione a 2.4.0 in `config.js`, `?v=` in `index.html` e `manifest.webmanifest`, cache in `sw.js`, note in `version.json`; verificare che l'app mostri 2.4.0
- [ ] 3.2 Prova con login sui dati veri (foglio schede tecniche reale) dopo il push

## Workflow follow-up

- Archiviare la modifica (`openspec archive assistente-prossima-escursione`) dopo la prova con i dati veri.
