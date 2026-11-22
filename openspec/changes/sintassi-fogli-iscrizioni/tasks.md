## 1. Riconoscimento dei fogli

- [x] 1.1 In `docs/js/config.js` sostituire `escursioniNamePrefix` con `escursioniNamePrefixes: ["Iscrizioni", "Form Iscrizione"]` e cercare con grep che nel codice non resti nessun uso del vecchio nome
- [x] 1.2 In `docs/js/google.js` aggiungere la funzione condivisa che dal nome del file restituisce data, data ISO e nome dell'uscita, oppure null (design, decisione 1); verificare dalla console in `?demo=1` i casi degli scenari: sintassi nuova, vecchia con virgolette, due giorni, apostrofo, "Iscrizioni soci 2027" → null
- [x] 1.3 Usare la funzione in `loadEscursioni` e `watchFiles`, con una sola query Drive a due condizioni e ordine per data poi nome (design, decisioni 3 e 4); verificare in demo che l'elenco sia cronologico con le due sintassi mescolate
- [x] 1.4 In `docs/index.html` far usare la funzione a `formatNomeUscita` e `formDateFromTitle` e aggiornare il messaggio "nessun foglio trovato" con la sintassi nuova; verificare in demo che contatore partecipazioni, curriculum, uscite mancanti nelle statistiche e assistente "Prossima uscita" mostrino i nomi giusti

## 2. Dati demo e documentazione

- [x] 2.1 In `docs/js/demo.js` rinominare i fogli demo con la sintassi nuova, aggiungendo un'uscita di due giorni e lasciandone una con la sintassi vecchia; verificare con `?demo=1` che compaiano tutte con nome e data corretti
- [x] 2.2 Aggiornare `README.md` (funzionalità e tabella "Dove finiscono i dati") con le due sintassi; verificare con grep che non resti "Form Iscrizione …" come unica sintassi citata
- [x] 2.3 Aggiornare gli artefatti di `openspec/changes/assistente-prossima-escursione/` (proposal, design, specifiche) sostituendo "Form Iscrizione …" con i fogli risposte nelle due sintassi; verificare con `openspec validate assistente-prossima-escursione`

## 3. Rilascio

- [x] 3.1 Portare la versione a 2.4.2 in `config.js`, `?v=` in `index.html` e `manifest.webmanifest`, cache in `sw.js`, note in `version.json`; verificare in `?demo=1` che l'app mostri 2.4.2 e l'avviso di aggiornamento
- [ ] 3.2 Dopo il push, prova con login sui dati veri: verificare che la scheda Escursioni mostri i fogli rinominati in ordine cronologico, con le conferme e le note già salvate, e che le notifiche dei nuovi iscritti funzionino

## Workflow follow-up

- Archiviare prima `assistente-prossima-escursione`, poi questa change (`openspec archive sintassi-fogli-iscrizioni`), per l'ordine spiegato nel design.
