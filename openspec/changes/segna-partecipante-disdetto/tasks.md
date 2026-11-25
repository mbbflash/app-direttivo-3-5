## 1. Database condiviso

- [x] 1.1 In `docs/js/clouddb.js` aggiungere `disdetto` alle intestazioni di `Conferme_Escursioni`, leggerla in `parseTab` (`cancelled`), scriverla in `buildRow` e riportarla nel `Log` — verifica: in `?demo=1` una disdetta compare nella scheda demo con H = SI e nel Log
- [x] 1.2 Alla lettura, se H1 di `Conferme_Escursioni` è vuota scrivere `disdetto` senza toccare le altre celle — verifica: database demo senza H1 → dopo il caricamento H1 = `disdetto`, A1:G1 invariate

## 2. Scheda Escursioni

- [x] 2.1 Funzione unica per le righe non disdette di un'uscita e invalidazione della cache del contatore al cambio di una disdetta — verifica: segnando un disdetto il suo "N° escursioni" scende di 1 senza ricaricare
- [x] 2.2 Tabella adesioni: pulsante "Disdetto"/"Annulla disdetta", riga barrata con etichetta in fondo all'elenco, conferma tolta alla disdetta, stile in tema chiaro e scuro — verifica: in demo, su PC e larghezza telefono
- [x] 2.3 Riepilogo (adesioni, già soci, confermati, testo con "N disdetti"), avvisi e CCN senza disdetti — verifica: in demo i numeri scendono e l'email del disdetto non viene copiata
- [x] 2.4 Export partecipanti senza disdetti — verifica: CSV scaricato in demo senza la riga del disdetto
- [x] 2.5 "Aggiungi al foglio statistiche" senza disdetti tra i presenti — verifica: in demo il disdetto non compare nell'elenco

- [x] 2.6 Pulsante "Email di conferma" sulla riga disdetta: `mailto:` con destinatario (form o Libro Soci), oggetto e testo concordati nel design; disattivato con spiegazione se manca l'email — verifica: in demo il link contiene destinatario, oggetto e testo giusti; su un iscritto senza email il pulsante è disattivato

## 3. Prova e rilascio

- [x] 3.1 Prova completa in `?demo=1`: disdetta, annullamento, ricarica pagina (la disdetta resta), nessun errore in console
- [ ] 3.2 Prova con login sui dati veri su un'uscita di prova: la colonna H viene creata, il foglio risposte resta invariato
- [x] 3.3 Rilascio: `git pull`, versione successiva a quella su `main` in `docs/js/config.js`, tutti i `?v=` in `index.html` e `manifest.webmanifest`, nuovo nome cache in `sw.js`, note in `version.json` (citare che le presenze già registrate nel foglio statistiche vanno tolte a mano), README (sezione Escursioni e badge)

## Workflow follow-up

- Dopo il rilascio: `/openspec-archive-change` per portare i requisiti in `openspec/specs/`.
