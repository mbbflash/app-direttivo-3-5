## Why

I fogli risposte delle escursioni nel Drive sono stati rinominati con una nuova sintassi, `Iscrizioni AAAA.MM.GG - Nome (Risposte)`. L'app invece riconosce solo i fogli che iniziano con "Form Iscrizione", quindi oggi non vede più le uscite rinominate. Con loro smettono di funzionare anche il contatore partecipazioni, il curriculum dei soci, le notifiche dei nuovi iscritti e l'assistente "Prossima uscita". La correzione è urgente e serve anche come base per la futura creazione automatica dei form.

## What Changes

- L'app riconosce come foglio di un'uscita ogni foglio di calcolo il cui nome segue una di queste due sintassi (maiuscole e minuscole indifferenti):
  - nuova: `Iscrizioni AAAA.MM.GG - Nome (Risposte)`;
  - vecchia: `Form Iscrizione AAAA.MM.GG - "Nome" (Risposte)`.
- Per le uscite di più giorni la data può avere un secondo giorno (`AAAA.MM.GG-GG`). La data dell'uscita è il primo giorno.
- Dopo il prefisso ci deve essere la data: un foglio come "Iscrizioni soci 2027" non viene scambiato per un'uscita.
- Il nome dell'uscita è il testo tra virgolette, se c'è. Altrimenti è il testo tra " - " e " (Risposte)".
- Le uscite sono ordinate per la data letta dal nome, non più in ordine alfabetico, perché con due prefissi l'ordine alfabetico non sarebbe cronologico.
- Le stesse regole valgono ovunque l'app usa questi fogli: scheda Escursioni, contatore partecipazioni, curriculum, notifiche dei nuovi iscritti, uscite mancanti nel foglio statistiche, assistente "Prossima uscita".
- I dati demo (`?demo=1`) contengono esempi di entrambe le sintassi e un'uscita di due giorni.
- Il README e la change in corso `assistente-prossima-escursione` vengono aggiornati alla nuova sintassi.

Fogli Google:
- letti come oggi, in sola lettura: i fogli risposte delle escursioni (primo foglio, colonne A:AZ); cambia solo come vengono riconosciuti per nome;
- nessun foglio nuovo, nessuna nuova scrittura;
- lo schema del database condiviso NON cambia: conferme e note sono legate all'ID del file, quindi i fogli rinominati le ritrovano.

Fuori da questa modifica:
- nessuna rinomina automatica dei fogli nel Drive;
- nessun trattamento speciale per le uscite segnate "[RIMANDATA]" o per gli eventi che non sono escursioni (cene, pizzate, geocaching): continuano a essere contati come oggi;
- nessuna creazione di form o fogli, che appartiene alla change `crea-form-escursione`.

## Capabilities

### New Capabilities

### Modified Capabilities
- `escursioni`: l'elenco delle uscite riconosce le due sintassi del nome, ricava data e nome dell'uscita dal nome del foglio e ordina per data.
- `fogli-google`: il requisito dei fogli in sola lettura cita i fogli risposte delle escursioni con le due sintassi al posto di "Form Iscrizione …".

## Impact

- `docs/js/config.js`: i prefissi riconosciuti.
- `docs/js/google.js`: ricerca dei fogli delle uscite (`loadEscursioni`) e controllo dei cambiamenti per le notifiche (`watchFiles`).
- `docs/index.html`: estrazione di nome e data dal nome del foglio (`formatNomeUscita`, `formDateFromTitle`) e messaggio "nessun foglio trovato".
- `docs/js/demo.js`: nomi dei fogli demo.
- `README.md` e gli artefatti di `openspec/changes/assistente-prossima-escursione/`.
- Richieste a Google: una ricerca Drive in più o una query con due condizioni, che non incide in modo apprezzabile sul limite condiviso.
- Rilascio: nuova versione (config, `?v=`, cache del service worker, version.json).
