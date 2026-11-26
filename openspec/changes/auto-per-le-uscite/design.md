## Context

Vedi `proposal.md` per il motivo. Le risposte dei moduli d'iscrizione sono già lette dall'app (`esc.rows`, solo lettura) e le disdette stanno in `Conferme_Escursioni`. Le domande del modulo sull'auto sono fisse nel template: "Città da dove parti", "Sei automunito/a per questo evento?", "Se si, saresti disposto/a a mettere il tuo mezzo a disposizione?" e "…scrivici con chi sei in auto". Il modulo non chiede i posti liberi.

## Goals / Non-Goals

**Goals:**
- Auto proposte senza nessuna scelta da parte dell'utente, ricalcolate a ogni nuova iscrizione o disdetta.
- Correzioni a mano condivise e che restano valide quando arrivano nuove iscrizioni.
- Nessuna dipendenza, nessun servizio esterno, nessuna richiesta Google periodica in più.

**Non-Goals:**
- Percorsi stradali esatti o tempi di viaggio.
- Ottimizzazione perfetta: basta una proposta sensata da correggere a mano.

## Decisions

1. **Calcolo, non salvataggio del piano.** Le auto si ricalcolano ogni volta dalle risposte; nel database si salvano solo le scelte fatte a mano (`guida`, `con`, `posti`, ritrovo, partenza…). Così nuove iscrizioni e disdette entrano da sole e le correzioni restano. Alternativa scartata: salvare l'intero piano, che andrebbe rifatto a ogni iscrizione.
2. **Scheda `Auto_Escursioni` con una riga per uscita** (chiave = id del foglio risposte) e le impostazioni in una cella JSON. Due chiavi speciali valgono per tutte le uscite: `_zone` (paesi uniti nella stessa zona) e `_opzioni` (distanza massima). Usa la stessa coda di `clouddb.js` (ultima riga con la stessa chiave vince, voce in `Log`).
3. **Posizioni approssimate nel codice.** Una tabella di paesi di Lucchesia, Versilia, Garfagnana, Pisano, Valdinievole, Pistoiese, Prato, Massa-Carrara e Val di Magra, più i ritrovi abituali, con latitudine e longitudine. Il paese si trova anche dentro risposte come "Marlia (Capannori)". Paesi sconosciuti: si possono unire a una zona; altrimenti la persona va per conto suo. Alternativa scartata: servizi di geocodifica o mappe (dipendenza esterna, chiavi, dati personali in uscita).
4. **Deviazione verso la destinazione.** Con il ritrovo noto, un passaggio vale se `dist(chi guida, passeggero) + dist(passeggero, destinazione) − dist(chi guida, destinazione)` è entro la deviazione massima; la destinazione è la partenza se per chi guida è più vicina del ritrovo, altrimenti il ritrovo.
5. **Secondo tratto calcolato a parte**: dal ritrovo si scelgono le auto che possono guidare, prima quelle più piene, finché i posti bastano; gli altri gruppi salgono interi dove c'è posto.
6. **Claude facoltativo.** Solo dove `window.claude.use("sample")` esiste (anteprima su claude.ai). Le persone sono mandate come `p1, p2…` con città e risposte sull'auto, mai nomi, email o telefoni. La risposta JSON viene controllata (chi guida può guidare, posti, nessun doppione) prima di essere mostrata o applicata, ed è salvata come correzioni a mano con la firma dei dati usati: se i dati cambiano, si richiede di nuovo.

## Risks / Trade-offs

- [Linea d'aria tra paesi separati da montagne] → deviazione massima di base prudente (15 km), correzioni a mano e, dove c'è, la proposta di Claude.
- [Nomi nella risposta "con chi sei in auto" ambigui] → si abbina solo se il nome corrisponde a un solo iscritto.
- [Versioni vecchie dell'app] → ignorano la scheda nuova; nessuna colonna esistente cambia.
