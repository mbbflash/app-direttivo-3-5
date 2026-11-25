## ADDED Requirements

### Requirement: Lettura delle schede tecniche
Il sistema SHALL leggere, all'apertura della scheda "Prossima uscita", il primo foglio (colonne A:K) del foglio Google il cui nome inizia con "Tre Quinti Trekking - Schede Tecniche Escursioni", trovato per nome nel Drive dell'account, e SHALL ricavare da ogni riga anno, nome, difficoltà, lunghezza in km, durata in ore, dislivello in metri, quota massima e minima, partenza, ritrovo e descrizione, accettando testo libero come "5,2 km", "5.30 h con pause" o "900 m (+500 m / +400 m)".

#### Scenario: Durata con minuti
- **WHEN** la durata è "5.30 h con pause"
- **THEN** il sistema la considera 5 ore e mezza

#### Scenario: Stesso percorso in più anni
- **WHEN** "Le Apuane Nascoste" compare sia nel 2024 sia nel 2026
- **THEN** l'assistente mostra un solo percorso con i dati dell'anno più recente e gli anni in cui è stato proposto

#### Scenario: Foglio non trovato
- **WHEN** nel Drive non c'è un foglio con quel prefisso
- **THEN** la scheda mostra un messaggio che indica il nome da cercare

### Requirement: Filtri della scelta
Il sistema SHALL permettere di indicare la data prevista (per la stagione), la difficoltà massima, il dislivello massimo, la durata massima, il punto di ritrovo e l'esclusione dei percorsi fatti negli ultimi 12 mesi, e SHALL escludere dalle proposte i percorsi che non rispettano i filtri.

#### Scenario: Difficoltà massima
- **WHEN** l'utente sceglie difficoltà massima "Medio"
- **THEN** i percorsi "Medio-Difficile" e "Difficile" non compaiono tra le proposte

### Requirement: Punteggio motivato
Il sistema SHALL ordinare i percorsi con un punteggio da 0 a 100 calcolato con regole fisse su stagione e quota, tempo dall'ultima volta, partecipazione media rispetto alle altre uscite e varietà rispetto alle ultime uscite, e SHALL mostrare per ogni proposta le motivazioni positive e negative.

#### Scenario: Quota alta d'inverno
- **WHEN** la data prevista è a gennaio e il percorso supera i 1500 m di quota massima
- **THEN** il punteggio si abbassa e compare la motivazione "quota alta d'inverno: possibile neve"

#### Scenario: Percorso fatto da poco
- **WHEN** il percorso risulta fatto meno di 12 mesi prima della data prevista
- **THEN** il punteggio si abbassa e la motivazione indica quanti mesi sono passati

#### Scenario: Uscita rimandata da recuperare
- **WHEN** l'ultima uscita del percorso ha il foglio iscrizioni segnato rimandata o annullata, da non più di 18 mesi, e il percorso non è stato rifatto né è in programma
- **THEN** il punteggio sale di 20 e compare la motivazione "rimandata il GG/MM/AAAA: da recuperare (N iscritti)"
- **AND** quell'uscita non conta come fatta (nessuna penalità "fatta da poco") né come "già in programma"

### Requirement: Incrocio con presenze e iscrizioni
Il sistema SHALL ricavare la data dell'ultima volta e le presenze medie di ogni percorso dal foglio statistiche e dai fogli risposte delle uscite ("Iscrizioni AAAA.MM.GG - …" o "Form Iscrizione AAAA.MM.GG - …"), abbinando i nomi per parole in comune, e SHALL funzionare anche senza queste fonti usando la colonna Anno. I percorsi che hanno un form con data futura SHALL essere esclusi con l'indicazione "già in programma".

#### Scenario: Statistiche non disponibili
- **WHEN** il foglio statistiche non si riesce a leggere
- **THEN** l'assistente propone comunque i percorsi usando l'anno della scheda tecnica

#### Scenario: Uscita già in programma
- **WHEN** esiste un foglio risposte di un'uscita con data futura per quel percorso
- **THEN** il percorso non compare tra le proposte e risulta "già in programma"

### Requirement: Annuncio pronto
Il sistema SHALL mostrare per ogni proposta i dati tecnici, il ritrovo e la descrizione, e SHALL permettere di copiare un annuncio di testo con nome, difficoltà, lunghezza, dislivello, durata, quota massima, partenza, ritrovo e descrizione.

#### Scenario: Copia annuncio
- **WHEN** l'utente preme "Copia annuncio" su una proposta
- **THEN** negli appunti finisce il testo dell'annuncio pronto da incollare su Telegram, WhatsApp o email
