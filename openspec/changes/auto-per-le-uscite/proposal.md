## Why

Per ogni uscita il direttivo organizza a mano chi va in auto con chi, leggendo le risposte del modulo d'iscrizione: città di partenza, chi è automunito, chi mette l'auto a disposizione e con chi è già d'accordo. È un lavoro lungo che si rifà a ogni nuova iscrizione o disdetta. L'app ha già tutte queste risposte e può proporre le auto da sola.

## What Changes

- Nella scheda Escursioni, sotto gli avvisi e le comunicazioni, nuova sezione richiudibile **"Auto per l'uscita"** per l'uscita selezionata.
- Le auto si formano in automatico dalle risposte del modulo, senza scegliere colonne:
  - zona = risposta a "Città da dove parti";
  - guida solo chi è automunito **e** mette il mezzo a disposizione; chi è automunito ma non lo mette a disposizione viaggia come passeggero;
  - chi scrive "con chi sei in auto" viene messo nella stessa auto delle persone nominate, se il nome corrisponde a un solo iscritto;
  - 4 posti liberi per auto di base, modificabili;
  - chi ha disdetto non viene contato.
- Calcolo:
  - per ogni città il minor numero di auto;
  - chi non ha un'auto della sua città va nell'auto più vicina con posto, solo se chi guida non allunga la strada verso la sua destinazione oltre una deviazione massima (15 km in linea d'aria di base, modificabile). Le posizioni dei paesi della zona e dei ritrovi abituali sono scritte nel codice;
  - chi non ha una soluzione vicina va "per conto suo" (insieme a chi ha indicato come compagno di viaggio), con un avviso se non ha dichiarato l'auto;
  - conta il **punto di ritrovo** (dalla scheda tecnica del percorso con lo stesso nome; altrimenti il ritrovo principale "Bar Millibar") e la **partenza dell'escursione** (dalla scheda tecnica o scritta a mano): un'auto va direttamente alla partenza se per chi guida è più vicina del ritrovo;
  - **dal ritrovo alla partenza** ripartono solo le auto necessarie: le auto arrivate piene restano com'è, chi arriva da solo lascia l'auto al ritrovo e sale dove c'è posto.
- Correzioni a mano (chi guida, posti, chi va con chi, ritrovo, partenza, distanza massima, paesi uniti in una zona) condivise con il direttivo; si annullano con un clic.
- Pulsante "Copia riepilogo per il gruppo" con le auto da casa e dal ritrovo.
- Quando l'app è aperta dentro Claude (anteprima su claude.ai), un pulsante chiede a Claude di organizzare le auto ragionando sulle strade vere; la proposta, se nessuno ha fatto correzioni a mano, si applica da sola. A Claude vanno solo città e risposte sull'auto, con codici al posto dei nomi. Su GitHub Pages questa funzione non c'è e resta il calcolo automatico.
- Dati di prova in `?demo=1` (nomi inventati) per la nuova sezione.

Fogli Google:
- letti: i fogli risposte delle uscite (come oggi, solo lettura) e, se serve il ritrovo o la partenza, il foglio delle schede tecniche (solo lettura, già usato dall'assistente "Prossima uscita");
- scritto: "NON TOCCARE - DATABASE APP DI GESTIONE", nuova scheda `Auto_Escursioni`. **Lo schema del database condiviso cambia.**
- i fogli risposte, il Libro Soci e il foglio statistiche non vengono scritti.

Fuori da questa modifica:
- percorsi e tempi su strada calcolati con servizi esterni (mappe): si usano posizioni approssimate e linea d'aria;
- rimborsi spese o quote per chi guida;
- invio automatico del riepilogo nei gruppi;
- modifica del template del modulo (per esempio una domanda sui posti liberi).

## Capabilities

### New Capabilities
- `auto-uscite`: formazione automatica delle auto di un'uscita dalle risposte del modulo, con ritrovo, partenza, secondo tratto dal ritrovo, correzioni condivise e riepilogo.

### Modified Capabilities
- `database-condiviso`: lo schema aggiunge la scheda `Auto_Escursioni`.

## Impact

- `docs/index.html`: sezione "Auto per l'uscita" (calcolo, interfaccia, posizioni dei paesi e dei ritrovi, richiesta facoltativa a Claude).
- `docs/js/clouddb.js`: nuovo tipo `auto` con scheda `Auto_Escursioni` (chiave, escursione, impostazioni in JSON, aggiornato_il, aggiornato_da), letta insieme alle altre.
- `docs/js/app.js`: descrizione leggibile delle righe `Auto_Escursioni` e cache locale.
- `docs/js/demo.js`: domande sull'auto nei fogli di prova e iscritti di prova per un'uscita.
- Limiti Google: la scheda nuova entra nella lettura unica del database; le schede tecniche si leggono una volta sola, solo se non sono già state lette. Nessuna richiesta periodica in più.
- Rilascio: nuova versione (config, `?v=`, cache del service worker, version.json, README).
