## Context

Vedi `proposal.md` per il motivo. Le risposte dei moduli d'iscrizione sono già lette dall'app (`esc.rows`, solo lettura) e le disdette stanno in `Conferme_Escursioni`. Le domande del modulo sull'auto sono fisse nel template: "Città da dove parti", "Sei automunito/a per questo evento?", "Se si, saresti disposto/a a mettere il tuo mezzo a disposizione? (dal punto di ritrovo fino al raggiungimento del punto di partenza dell'evento)" e "…scrivici con chi sei in auto".

La 2.6.0 calcolava anche il viaggio da casa al ritrovo con posizioni approssimate dei paesi, deviazioni in linea d'aria e scelte di strada: risultato troppo complesso da capire e poco affidabile tra valli e montagne. La 2.6.1 lo sostituisce.

## Goals / Non-Goals

**Goals:**
- Auto dal ritrovo proposte senza nessuna scelta da parte dell'utente, ricalcolate a ogni nuova iscrizione o disdetta.
- Elenco semplice per città per accordarsi sul viaggio fino al ritrovo.
- Correzioni a mano condivise che restano valide quando arrivano nuove iscrizioni.
- Nessuna dipendenza, nessun servizio esterno, nessuna richiesta Google periodica in più.

**Non-Goals:**
- Percorsi, distanze o tempi di viaggio.
- Decidere chi va con chi da casa al ritrovo.

## Decisions

1. **Calcolo, non salvataggio del piano.** Le auto si ricalcolano ogni volta dalle risposte; nel database si salvano solo le scelte a mano (`guida`, `con`, `posti`, `ritrovo`).
2. **Numero di auto**: si aggiunge chi può guidare finché i posti (chi guida + posti liberi) bastano per tutti quelli al ritrovo. Ordine: prima chi ha in città persone senza auto non ancora coperte (le può portare già da casa), poi chi viaggia con altri, poi chi ha più posti, poi l'ordine del modulo.
3. **Compagni di viaggio**: i gruppi indicati con "con chi sei in auto" vanno interi nell'auto di uno di loro o in quella che li contiene meglio, preferendo chi guida dalla stessa città.
4. **Domande facoltative** riconosciute dal testo: "posti" per i posti liberi; "ci vediamo / direttamente alla partenza" per chi non passa dal ritrovo. Assenti → 4 posti e tutti al ritrovo.
5. **Scheda `Auto_Escursioni`**: una riga per uscita (scelte "solo per questa uscita", auto fissate, ritrovo) e una riga per partecipante con le abitudini (`_p:<chiave>`), così modifiche contemporanee a persone diverse non si sovrascrivono. Prima: una riga per uscita (chiave = id del foglio risposte) e le impostazioni in una cella JSON, con la stessa coda di `clouddb.js`. Le impostazioni della 2.6.0 non più usate (zone, distanze, scelte di strada) vengono ignorate.

## Risks / Trade-offs

- [Chi guida dal ritrovo è scelto in modo semplice] → menu "guida …" accanto a ogni auto per cambiarlo.
- [Nomi nella risposta "con chi sei in auto" ambigui] → si abbina solo se il nome corrisponde a un solo iscritto.
- [Versioni vecchie dell'app] → ignorano la scheda nuova; nessuna colonna esistente cambia.

6. **Posizioni approssimate dei paesi** (tabella nel codice) usate solo per i suggerimenti "entro 10 km" nella scheda, mai per formare le auto.

