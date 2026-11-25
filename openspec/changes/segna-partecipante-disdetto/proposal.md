## Why

Quando un iscritto disdice, oggi la sua riga resta nell'elenco dell'uscita e continua a contare
nei totali, negli avvisi, nelle email in CCN, nell'export e nel numero di escursioni fatte. Il
direttivo vuole poterlo togliere dall'escursione con un clic, senza però cancellare la risposta
dal foglio del modulo (operazione difficile da annullare e che toccherebbe un foglio che l'app
oggi si limita a leggere).

## What Changes

- Nella tabella "Adesioni dell'escursione selezionata" ogni iscritto ha un comando
  **"Disdetto"**; un iscritto disdetto compare barrato, in fondo all'elenco, con l'etichetta
  "Disdetto" e il comando **"Annulla disdetta"**.
- Segnare un iscritto come disdetto toglie la sua spunta "Confermato"; la nota resta.
- Un iscritto disdetto non conta in: adesioni e soci nel riepilogo, numero di confermati,
  avvisi dell'uscita, email in CCN, export dei partecipanti, numero di escursioni fatte
  (colonna "N° escursioni", "Escursionisti unici", curriculum del socio dai form) e presenti
  proposti in "Aggiungi al foglio statistiche".
- Sulla riga di un disdetto il comando **"Prepara email di disdetta"** apre il programma di posta con
  la mail all'iscritto già scritta (destinatario, oggetto, testo con nome e data dell'uscita):
  l'utente la rilegge e la invia lui. Disattivato se l'iscritto non ha email.
- La disdetta si salva nel database condiviso, quindi è visibile a tutto il direttivo, e
  finisce nel `Log` come le altre modifiche.

**Fogli Google**
- Letti: fogli risposte delle uscite (invariato, solo lettura), database condiviso.
- Scritti: solo il database condiviso "NON TOCCARE - DATABASE APP DI GESTIONE", schede
  `Conferme_Escursioni` e `Log`.
- **Cambio di schema del database condiviso**: la scheda `Conferme_Escursioni` riceve una
  nuova colonna in coda, `disdetto` (colonna H, valori SI/NO). Le colonne esistenti non
  cambiano posizione; l'app aggiunge l'intestazione da sola se manca. Le versioni precedenti
  dell'app continuano a funzionare (scrivono solo le colonne A:G e ignorano la H).

**Cosa resta fuori**
- La riga nel foglio risposte del modulo **non** viene cancellata né modificata.
- Il foglio statistiche "Tre Quinti Wrapped - Foglio Calcolo" non viene toccato: se una
  presenza di un disdetto è già stata registrata lì, va tolta a mano.
- Nessun invio automatico dell'email di conferma e nessuna traccia nel database del fatto che
  sia stata inviata.
- Nessun avviso o notifica quando qualcuno disdice; nessuna disdetta da parte dell'iscritto
  stesso (la segna solo il direttivo dall'app).

## Capabilities

### New Capabilities

(nessuna)

### Modified Capabilities

- `escursioni`: nuovo requisito sulla disdetta di un iscritto ed esclusione dei disdetti da
  totali, avvisi, CCN, export e contatore partecipazioni.
- `database-condiviso`: la scheda `Conferme_Escursioni` ha la colonna `disdetto` e l'app
  aggiunge le intestazioni mancanti in coda a una scheda esistente.
- `statistiche`: i disdetti non sono proposti tra i presenti nell'aggiunta al foglio.

## Impact

- `docs/js/clouddb.js`: colonna `disdetto` nella scheda `Conferme_Escursioni`, lettura,
  scrittura, log e aggiunta dell'intestazione mancante.
- `docs/index.html`: tabella adesioni (comando, stile barrato, ordinamento), riepilogo,
  `analyzeEscursione`, export, contatore partecipazioni, pannello "Aggiungi al foglio
  statistiche", stile CSS.
- `docs/js/demo.js` solo se serve per provare la colonna nuova in `?demo=1`.
- Rilascio: nuova versione (2.5.5 se nessun altro rilascio la precede), `?v=`, cache del
  service worker, `version.json`, README.
