## 1. Database e dati

- [x] 1.1 In `docs/js/clouddb.js` aggiungere il tipo `auto` con la scheda `Auto_Escursioni` (creata con le intestazioni se manca, letta nella `batchGet` iniziale, impostazioni in JSON); in `docs/js/app.js` descrizione leggibile delle righe (`_zone`, `_opzioni`, nome dell'uscita) e cache locale
- [x] 1.2 Lettura dal foglio risposte di città, automunito, mezzo a disposizione e "con chi sei in auto", senza scegliere colonne; abbinamento dei compagni di viaggio; esclusione dei disdetti

## 2. Calcolo

- [x] 2.1 Auto per città con il minor numero di auto; passaggi entro la deviazione massima; "per conto suo" quando non c'è un'auto vicina
- [x] 2.2 Posizioni dei paesi e dei ritrovi; ritrovo e partenza dalla scheda tecnica (ritrovo principale "Bar Millibar" se manca); auto direttamente alla partenza
- [x] 2.3 Secondo tratto dal ritrovo alla partenza con meno auto possibile
- [x] 2.4 Correzioni a mano e impostazioni salvate in `Auto_Escursioni`; pulsante per annullarle

## 3. Interfaccia

- [x] 3.1 Sezione "Auto per l'uscita": ritrovo e partenza in cima, stato (calcolo automatico, corrette a mano, Claude), avvisi essenziali, elenchi "Da casa" e "Dal ritrovo alla partenza", riquadri chiusi "Correggi a mano" e "Impostazioni"
- [x] 3.2 "Copia riepilogo per il gruppo"
- [x] 3.3 Proposta di Claude solo dove `claude.use("sample")` esiste, con controllo della risposta e applicazione automatica se non ci sono correzioni a mano
- [x] 3.4 Dati di prova in `docs/js/demo.js` (domande sull'auto, iscritti inventati) e verifica in `?demo=1` senza errori in console
- [x] 3.5 README: funzione nella scheda Escursioni e scheda `Auto_Escursioni` nella tabella "Dove finiscono i dati"

## 4. Rilascio

- [x] 4.1 Versione 2.6.0 in `config.js`, `?v=` in `index.html` e `manifest.webmanifest`, cache in `sw.js`, note in `version.json`
- [ ] 4.2 Dopo il push, prova con login sui dati veri: aprire un'uscita con iscrizioni, controllare che le domande del modulo siano riconosciute e che la scheda `Auto_Escursioni` venga creata alla prima correzione

## Workflow follow-up

- Archiviare questa change (`openspec archive auto-per-le-uscite`) dopo la prova con i dati veri.
