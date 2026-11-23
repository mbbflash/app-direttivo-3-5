# statistiche Specification

## Purpose
Mostra le presenze effettive alle escursioni leggendole dal foglio "Tre Quinti Wrapped - Foglio Calcolo", che resta la fonte di verità compilata anche a mano, e aiuta ad aggiungervi le uscite dei form che mancano, scrivendo solo dopo anteprima e conferma.

## Requirements

### Requirement: Lettura del foglio statistiche
Il sistema SHALL leggere tutte le schede del foglio statistiche il cui nome è "DatiEscursioni" seguito da un anno a quattro cifre, colonne A:G (Socio, =UPPER(A), Data, NomeEscursione, Ore, Km, Dislivello), ignorando le righe senza socio e interpretando i numeri sia con la virgola sia con il punto.

#### Scenario: Numero con virgola
- **WHEN** una cella Km contiene "8,5"
- **THEN** il sistema la legge come 8,5 km

#### Scenario: Scheda con nome diverso
- **WHEN** il foglio contiene una scheda "Totali"
- **THEN** il sistema la ignora

### Requirement: Uscite rimandate o annullate escluse
Il sistema SHALL considerare rimandata o annullata un'uscita il cui nome del foglio iscrizioni contiene "rimandata" o "annullata" (anche "rimandato", "annullato", "cancellata", tra parentesi quadre o tonde o senza, maiuscole e minuscole indifferenti), e MUST escluderla da: contatore partecipazioni e curriculum dai form, uscite dei form mancanti nel foglio statistiche, uscite già fatte o in programma dell'assistente (che invece le usa per il bonus "da recuperare"). Le righe del foglio statistiche il cui NomeEscursione contiene le stesse parole MUST essere escluse da totali, grafico, classifica, elenco e curriculum. L'uscita resta visibile nella scheda Escursioni con lo stato accanto al nome, e il nome mostrato non contiene il segno.

#### Scenario: Uscita rimandata nei form
- **WHEN** esiste il foglio "Iscrizioni 2026.10.11 - [RIMANDATA] Lago (Risposte)" con 2 iscritti
- **THEN** l'uscita compare nella scheda Escursioni come "Lago · RIMANDATA"
- **AND** non aumenta il numero di uscite di nessun iscritto e non viene proposta tra quelle da aggiungere al foglio statistiche

#### Scenario: Riga annullata nel foglio statistiche
- **WHEN** una riga del foglio statistiche ha NomeEscursione "Monte Cella (annullata)"
- **THEN** la riga non conta in presenze, uscite, km, dislivello, ore e classifica

### Requirement: Riepilogo e grafici
Il sistema SHALL mostrare, per un anno scelto o per tutti gli anni e con ricerca per escursionista o uscita: numero di uscite, presenze, escursionisti, media per uscita, km, dislivello e ore totali; il grafico delle presenze per uscita; la classifica degli escursionisti (ordinabile); l'elenco delle uscite.

#### Scenario: Cambio anno
- **WHEN** l'utente sceglie l'anno 2025
- **THEN** totali, grafico, classifica ed elenco usano solo la scheda DatiEscursioni2025

### Requirement: Curriculum del socio con presenze vere
Il sistema SHALL mostrare nella scheda socio le presenze effettive del socio dal foglio statistiche con ore, km e dislivello totali.

#### Scenario: Socio con presenze
- **WHEN** l'utente apre la scheda di un socio che compare nel foglio statistiche
- **THEN** il curriculum elenca le sue uscite e i totali di ore, km e dislivello

### Requirement: Uscite dei form mancanti nel foglio
Il sistema SHALL segnalare le uscite dei form che non risultano nel foglio statistiche: con data ricavata dal nome del form (aaaa-mm-gg), non futura, non precedente al primo anno del foglio, e senza un'uscita nel foglio con la stessa data o con lo stesso nome nello stesso anno.

#### Scenario: Uscita passata non registrata
- **WHEN** esiste un form di un'uscita di due settimane fa che non compare nel foglio
- **THEN** l'uscita compare nell'elenco "da aggiungere" con il pulsante "Aggiungi al foglio"

#### Scenario: Uscita futura
- **WHEN** il form riguarda un'uscita di domani
- **THEN** non viene segnalata

### Requirement: Aggiunta al foglio con anteprima e conferma
Il sistema SHALL proporre data, nome uscita, ore, km e dislivello e l'elenco dei presenti (preselezionati quelli segnati "Confermato" o, se nessuno lo è, tutti), permettere di aggiungere presenti senza iscrizione, e MUST scrivere solo dopo una conferma esplicita che riepiloga cosa verrà scritto.

#### Scenario: Dati incompleti
- **WHEN** manca la data in formato gg/mm/aaaa, il nome, uno tra ore/km/dislivello, o nessun presente è selezionato
- **THEN** il sistema non scrive e indica cosa manca

#### Scenario: Scrittura confermata
- **WHEN** l'utente conferma l'aggiunta di 12 presenze
- **THEN** il sistema aggiunge 12 righe in fondo alla scheda DatiEscursioni dell'anno nel formato `Socio | =UPPER(A<riga>) | Data | NomeEscursione | Ore | Km | Dislivello`
- **AND** rilegge le statistiche

#### Scenario: Anno senza scheda
- **WHEN** l'uscita è di un anno per cui la scheda non esiste
- **THEN** il sistema crea la scheda DatiEscursioniAAAA con l'intestazione prima di scrivere, e lo dice nella richiesta di conferma

### Requirement: Grafia dei nomi coerente
Il sistema SHALL scrivere ogni presente usando la grafia del nome già presente nel foglio statistiche, se la persona c'è già, così che i totali della stessa persona restino uniti; altrimenti "Nome Cognome" con le iniziali maiuscole.

#### Scenario: Persona già nel foglio
- **WHEN** nel foglio c'è "Mario Rossi" e nel form "ROSSI MARIO"
- **THEN** la nuova riga usa "Mario Rossi"
