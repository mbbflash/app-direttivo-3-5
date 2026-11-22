## Context

Le motivazioni sono in proposal.md. Oggi il riconoscimento dei fogli delle uscite è distribuito in più punti:
- `config.js` ha un solo prefisso (`escursioniNamePrefix`);
- `google.js` cerca su Drive con `name contains` e poi filtra con `startsWith`, sia in `loadEscursioni` sia in `watchFiles` (notifiche), e ordina alfabeticamente;
- `index.html` ricava il nome dell'uscita (`formatNomeUscita`: testo tra virgolette, oppure toglie "Form Iscrizione AAAA.MM.GG") e la data (`formDateFromTitle`: prima data AAAA.MM.GG nel nome).

Conferme e note nel database condiviso sono indicizzate per ID del file, quindi la rinomina non richiede migrazioni.

## Goals / Non-Goals

**Goals:**
- Un'unica regola per riconoscere un foglio di uscita e ricavarne data e nome, usata da tutti i punti dell'app.
- Nessuna richiesta Google in più per il direttivo.

**Non-Goals:**
- Riconoscere sintassi diverse dalle due indicate.
- Cambiare come vengono contate le presenze (uscite rimandate, eventi non escursionistici).

## Decisions

### 1. Una sola funzione di riconoscimento, in `google.js`
Una funzione condivisa (esposta anche alla pagina) prende il nome di un file e restituisce `{ data, dataIso, nome }`, oppure `null` se il nome non è quello di un'uscita. Usa un'espressione regolare ancorata all'inizio, che non distingue maiuscole e minuscole:
`^(Iscrizioni|Form Iscrizione)\s+(\d{4})\.(\d{2})\.(\d{2})(-\d{2})?\s*-\s*(.+?)\s*(\(Risposte\))?$`
Il nome è il testo tra virgolette dentro il gruppo finale, se c'è, altrimenti il gruppo intero. `formatNomeUscita` e `formDateFromTitle` in `index.html` diventano semplici chiamate a questa funzione, così il contatore, le statistiche e l'assistente seguono la stessa regola senza toccarli uno per uno.
*Alternativa scartata:* aggiungere un secondo prefisso a `startsWith` lasciando le funzioni attuali. È più veloce ma lascia la regola sparsa in tre punti e non gestisce il nome senza virgolette.

### 2. Prefissi in configurazione come elenco
`config.js` passa da `escursioniNamePrefix` (stringa) a `escursioniNamePrefixes: ["Iscrizioni", "Form Iscrizione"]`. L'espressione regolare si costruisce da questo elenco. Il messaggio "nessun foglio trovato" mostra la sintassi nuova.

### 3. Una sola query Drive con due condizioni
`name contains 'Iscrizioni' or name contains 'Form Iscrizione'`, combinata con il filtro esistente su tipo foglio di calcolo e non cestinato. In Drive "contains" sui nomi lavora per prefissi di parole, e "Form Iscrizione …" non contiene la parola "Iscrizioni", quindi servono entrambe le condizioni. Resta una sola richiesta, come oggi. Il filtro preciso è poi l'espressione regolare sul lato app, che scarta i falsi positivi (per esempio il foglio "3 - Modulo Iscrizione …").

### 4. Ordine per data, poi per nome
L'elenco si ordina per `dataIso` e, a parità di data, per nome. I fogli che passano la query ma non l'espressione regolare vengono esclusi.

### 5. Dati demo
I fogli demo usano la sintassi nuova, con un'uscita di due giorni e una con la sintassi vecchia, così `?demo=1` copre tutti i casi.

## Risks / Trade-offs

- [Un foglio con un nome quasi giusto (data senza zeri, separatori diversi) non viene riconosciuto] → La regola richiede esattamente AAAA.MM.GG; l'elenco dei fogli rinominati rispetta questo formato. Il messaggio "nessun foglio trovato" mostra la sintassi attesa.
- [La change `assistente-prossima-escursione` modifica lo stesso requisito "Fogli in sola lettura" di `fogli-google`] → Questa change riporta il requisito completo, scheda tecnica compresa. Va archiviata **dopo** `assistente-prossima-escursione`, altrimenti all'archiviazione dell'assistente il vecchio testo tornerebbe in vigore.
- [ID dei fogli in cache sul dispositivo] → Non cambiano con la rinomina, quindi nessun effetto.

## Migration Plan

1. Rilascio della nuova versione: l'app riconosce subito i fogli già rinominati e quelli rimasti con la sintassi vecchia.
2. Nessuna migrazione del database.
3. Ritorno indietro: ripristinare la versione precedente. I fogli rinominati tornerebbero invisibili, ma nessun dato andrebbe perso.
