## Why

Per ogni uscita il direttivo organizza a mano chi va in auto con chi, leggendo le risposte del modulo d'iscrizione: città di partenza, chi è automunito, chi mette l'auto a disposizione e con chi è già d'accordo. È un lavoro lungo che si rifà a ogni nuova iscrizione o disdetta. L'app ha già tutte queste risposte e può proporre le auto da sola.

## What Changes

- Nella scheda Escursioni, sotto gli avvisi e le comunicazioni, nuova sezione richiudibile **"Auto per l'uscita"** per l'uscita selezionata.
- Il modulo chiede di mettere l'auto a disposizione *dal punto di ritrovo fino alla partenza*: l'app forma quindi **le auto che partono dal ritrovo**, senza calcoli di distanze:
  - guida solo chi è automunito **e** mette il mezzo a disposizione;
  - si usano le auto che bastano per tutti (auto da 5 posti di base, o 4/5 posti come dichiarato nel modulo), scegliendo prima chi ha in città qualcuno senza auto;
  - chi ha un ritrovo abituale diverso dal principale (es. Pisa, Camaiore) forma le auto con gli altri di quel punto;
  - le auto sono equilibrate e nessuno guida da solo se può salire in un'altra auto;
  - chi ha scritto "con chi sei in auto" resta nella stessa auto delle persone nominate;
  - chi ha detto che va **direttamente alla partenza** è elencato a parte;
  - chi ha disdetto non viene contato; se i posti non bastano, l'app lo dice.
- La schermata dell'uscita mostra solo ritrovo e auto; toccando un nome si apre la **scheda del partecipante** con ritrovo abituale, passaggio abituale (validi per tutte le uscite) e la scelta "solo per questa uscita". Per i soci si impostano anche dalla pagina del socio.
- Il ritrovo viene dalla scheda tecnica del percorso con lo stesso nome dell'uscita; se manca, si sceglie a mano tra i ritrovi abituali (nessun ritrovo predefinito).
- Correzioni a mano condivise con il direttivo: chi guida (menu accanto all'auto), posti, chi va con chi; si annullano con un clic.
- Pulsante "Copia riepilogo per il gruppo".
- Due domande facoltative nel modulo template, riconosciute da sole: "quanti posti ha la tua auto" (4 o 5) e "ci vediamo al punto di ritrovo o vai direttamente alla partenza". Senza, valgono 4 posti e tutti al ritrovo. Le aggiunge al template lo script di automazione (nuova operazione `aggiungi_domande_auto`, eseguibile una volta dall'editor).
- Dati di prova in `?demo=1` (nomi inventati).

Fogli Google:
- letti: i fogli risposte delle uscite (come oggi, solo lettura) e, se serve il ritrovo o la partenza, il foglio delle schede tecniche (solo lettura, già usato dall'assistente "Prossima uscita");
- scritto: "NON TOCCARE - DATABASE APP DI GESTIONE", nuova scheda `Auto_Escursioni`.
- modificato dallo script, una volta: il form template `[TEMPLATE] Form Iscrizione …` (due domande aggiunte). **Lo schema del database condiviso cambia.**
- i fogli risposte, il Libro Soci e il foglio statistiche non vengono scritti.

Fuori da questa modifica:
- percorsi, distanze e tempi su strada (né calcolati né chiesti a servizi esterni);
- organizzazione del viaggio da casa al ritrovo (solo l'elenco per città);
- rimborsi spese o quote per chi guida;
- invio automatico del riepilogo nei gruppi;
- l'aggiunta delle domande ai moduli delle uscite già create (vale solo per il template, quindi per le nuove uscite).

## Capabilities

### New Capabilities
- `auto-uscite`: auto dal ritrovo alla partenza formate dalle risposte del modulo, elenco per città per arrivare al ritrovo, correzioni condivise e riepilogo.

### Modified Capabilities
- `database-condiviso`: lo schema aggiunge la scheda `Auto_Escursioni`.

## Impact

- `docs/index.html`: sezione "Auto per l'uscita" (calcolo e interfaccia).
- `docs/js/clouddb.js`: nuovo tipo `auto` con scheda `Auto_Escursioni` (chiave, escursione, impostazioni in JSON, aggiornato_il, aggiornato_da), letta insieme alle altre.
- `docs/js/app.js`: descrizione leggibile delle righe `Auto_Escursioni` e cache locale.
- `apps-script/Codice.gs`: operazione `aggiungi_domande_auto` e funzione comune per trovare il template; da incollare nell'editor (SETUP-APPS-SCRIPT.md).
- `docs/js/demo.js`: domande sull'auto (anche le due nuove) nei fogli di prova e iscritti di prova per un'uscita.
- Limiti Google: la scheda nuova entra nella lettura unica del database; le schede tecniche si leggono una volta sola, solo se non sono già state lette. Nessuna richiesta periodica in più.
- Rilascio: 2.6.0 (prima versione con distanze), 2.6.1 (versione semplificata): config, `?v=`, cache del service worker, version.json, README.
