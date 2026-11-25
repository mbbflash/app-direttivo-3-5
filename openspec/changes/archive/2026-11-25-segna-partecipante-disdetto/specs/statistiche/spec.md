## MODIFIED Requirements

### Requirement: Aggiunta al foglio con anteprima e conferma
Il sistema SHALL proporre data, nome uscita, ore, km e dislivello e l'elenco dei presenti (preselezionati quelli segnati "Confermato" o, se nessuno lo è, tutti), permettere di aggiungere presenti senza iscrizione, e MUST scrivere solo dopo una conferma esplicita che riepiloga cosa verrà scritto. Gli iscritti segnati come disdetti MUST NOT comparire nell'elenco dei presenti proposti.

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

#### Scenario: Disdetti esclusi dai presenti
- **WHEN** l'utente apre "Aggiungi al foglio statistiche" per un'uscita con un iscritto disdetto
- **THEN** il disdetto non compare tra i presenti proposti
