## Purpose

Propone in automatico le auto di un'uscita dalle risposte del modulo d'iscrizione: chi guida, chi va con chi, dove ci si ritrova e quali auto ripartono dal ritrovo verso la partenza dell'escursione. Le correzioni a mano sono condivise con il direttivo.

## ADDED Requirements

### Requirement: Dati dal modulo
Il sistema SHALL ricavare per ogni iscritto non disdetto: la città dalla domanda che contiene "da dove parti"; se può guidare, cioè se ha risposto sì sia a "automunito" sia a "mezzo a disposizione" (solo "automunito" se la seconda domanda manca); e i compagni di viaggio dalla domanda "con chi sei in auto", abbinando un nome solo se corrisponde a un unico iscritto. I posti liberi di base SHALL essere 4.

#### Scenario: Automunito ma non disponibile
- **WHEN** un iscritto risponde SI a "automunito" e NO a "mezzo a disposizione"
- **THEN** non guida e viaggia come passeggero

#### Scenario: Compagno di viaggio
- **WHEN** un iscritto scrive "Marco" e un solo altro iscritto si chiama Marco
- **THEN** i due vengono messi nella stessa auto

### Requirement: Auto per città
Per ogni città il sistema SHALL usare il minor numero di auto tra chi può guidare. Chi resta senza posto SHALL andare nell'auto con posto per cui la deviazione è minore, solo se la deviazione non supera la distanza massima scelta (15 km di base); altrimenti SHALL risultare "per conto suo", insieme ai compagni di viaggio indicati.

#### Scenario: Una sola auto basta
- **WHEN** da una città partono cinque iscritti e tre possono guidare
- **THEN** guida uno solo e gli altri quattro viaggiano con lui

#### Scenario: Nessuna auto vicina
- **WHEN** nessuna auto con posto passa entro la distanza massima
- **THEN** l'iscritto è "per conto suo" e, se non ha dichiarato l'auto, compare un avviso

### Requirement: Ritrovo e partenza
Il sistema SHALL prendere il ritrovo dalla scheda tecnica del percorso con lo stesso nome dell'uscita, altrimenti SHALL usare il ritrovo principale "Bar Millibar"; la partenza dell'escursione dalla scheda tecnica o scritta a mano. Un'auto SHALL andare direttamente alla partenza quando, per chi guida, la partenza è più vicina del ritrovo.

#### Scenario: Partenza più vicina
- **WHEN** chi guida è più vicino alla partenza dell'escursione che al ritrovo
- **THEN** la sua auto è segnata "direttamente alla partenza" e i passaggi si calcolano verso la partenza

### Requirement: Dal ritrovo alla partenza
Con un ritrovo noto, il sistema SHALL proporre il secondo tratto con il minor numero di auto tra quelle arrivate al ritrovo con chi può guidare, tenendo insieme chi è arrivato insieme, e SHALL indicare chi lascia l'auto al ritrovo.

#### Scenario: Auto quasi vuote
- **WHEN** al ritrovo arrivano un'auto con due persone e tre auto con una persona ciascuna
- **THEN** dal ritrovo riparte una sola auto con tutti e cinque, e gli altri tre lasciano l'auto al ritrovo

### Requirement: Correzioni condivise
Le scelte fatte a mano (chi guida, posti, chi va con chi, ritrovo, partenza, distanza massima, paesi uniti in una zona) SHALL essere salvate nella scheda `Auto_Escursioni` del database condiviso e SHALL restare valide quando cambiano le iscrizioni. Un pulsante SHALL annullarle tutte.

#### Scenario: Nuova iscrizione
- **WHEN** dopo una correzione a mano arriva una nuova iscrizione
- **THEN** la correzione resta e il nuovo iscritto viene sistemato in automatico

### Requirement: Riepilogo
La sezione SHALL offrire "Copia riepilogo per il gruppo" con ritrovo, partenza, le auto da casa e, se c'è, il tratto dal ritrovo con chi lascia l'auto.

#### Scenario: Copia
- **WHEN** l'utente preme "Copia riepilogo per il gruppo"
- **THEN** negli appunti c'è il testo con le auto nello stesso ordine della sezione

### Requirement: Proposta di Claude
Dove l'app gira dentro Claude, il sistema SHALL poter chiedere a Claude una proposta mandando solo codici, città e risposte sull'auto, MUST NOT mandare nomi, email o telefoni, e SHALL scartare una risposta che non rispetta posti e chi può guidare. Se non ci sono correzioni a mano, la proposta SHALL applicarsi da sola; altrimenti SHALL essere offerta con un pulsante.

#### Scenario: App su GitHub Pages
- **WHEN** l'app non gira dentro Claude
- **THEN** la sezione mostra solo il calcolo automatico, senza pulsanti per Claude
