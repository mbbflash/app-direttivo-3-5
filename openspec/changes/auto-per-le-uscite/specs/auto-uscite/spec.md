## Purpose

Propone in automatico le auto che partono dal punto di ritrovo verso la partenza dell'escursione, dalle risposte del modulo d'iscrizione, e mostra chi parte da quale città per accordarsi sul viaggio fino al ritrovo. Le correzioni a mano sono condivise con il direttivo.

## ADDED Requirements

### Requirement: Dati dal modulo
Il sistema SHALL ricavare per ogni iscritto non disdetto la città (domanda "da dove parti"), se può guidare (sì sia a "automunito" sia a "mezzo a disposizione") e i compagni di viaggio (domanda "con chi sei in auto", abbinati solo se il nome corrisponde a un unico iscritto).

#### Scenario: Compagno di viaggio
- **WHEN** un iscritto scrive "Marco" e un solo altro iscritto si chiama Marco
- **THEN** i due risultano compagni di viaggio

### Requirement: Domande facoltative
Il sistema SHALL leggere i posti dell'auto dalla domanda che contiene "posti" (4 o 5 posti, chi guida compreso; con la vecchia domanda "posti liberi" il numero è quello dei passeggeri) e chi va direttamente alla partenza dalla domanda "ci vediamo al punto di ritrovo o vai direttamente alla partenza". Se mancano, SHALL usare auto da 5 posti e considerare tutti al ritrovo.

#### Scenario: Domande nuove assenti
- **WHEN** il foglio dell'uscita non ha le domande sui posti e sul ritrovo
- **THEN** ogni auto ha 5 posti (4 passeggeri) e tutti risultano al ritrovo

### Requirement: Chi guida
Il sistema SHALL far guidare dal ritrovo solo chi ha risposto sì sia a "automunito" sia a "mezzo a disposizione".

#### Scenario: Automunito ma non disponibile
- **WHEN** un iscritto risponde SI a "automunito" e NO a "mezzo a disposizione"
- **THEN** non guida dal ritrovo e viaggia come passeggero

### Requirement: Auto dal ritrovo
Il sistema SHALL usare il minor numero di auto che bastano per tutti gli iscritti al ritrovo, scegliendo chi guida tra chi può guidare, prima chi ha nella stessa città persone senza auto. I compagni di viaggio SHALL stare nella stessa auto quando ci stanno. Se i posti non bastano, il sistema SHALL indicare chi resta senza posto.

#### Scenario: Auto che bastano
- **WHEN** al ritrovo ci sono 14 iscritti e ogni auto ha 5 posti
- **THEN** dal ritrovo partono 3 auto

#### Scenario: Posti insufficienti
- **WHEN** chi può guidare non ha posti per tutti
- **THEN** la sezione indica quanti posti mancano e chi è senza posto

### Requirement: Auto equilibrate
Il sistema SHALL distribuire i passeggeri in modo equilibrato tra le auto dal ritrovo e MUST NOT lasciare chi guida da solo in auto quando può salire in un'altra auto con posto, salvo che il direttivo lo abbia fatto guidare a mano.

#### Scenario: Due auto per sette persone
- **WHEN** al ritrovo ci sono 7 persone e servono 2 auto da 5 posti
- **THEN** le auto hanno 4 e 3 persone, non 5 e 2

#### Scenario: Guidatore che resterebbe solo
- **WHEN** un'auto resterebbe con il solo guidatore e un'altra auto ha posto
- **THEN** quel guidatore sale nell'altra auto

### Requirement: Ritrovi intermedi
Per ogni uscita il direttivo SHALL poter indicare, città per città, che chi parte da quella città si ritrova in un punto intermedio (una delle città dell'uscita). Il sistema SHALL formare le auto separatamente per ogni punto intermedio e per il ritrovo principale, con le stesse regole. Chi non ha indicato la città SHALL seguire il punto del compagno di viaggio indicato.

#### Scenario: Versiliesi a Camaiore
- **WHEN** per Viareggio e Camaiore il direttivo sceglie "si ritrovano a Camaiore"
- **THEN** la sezione mostra "Ritrovo intermedio a Camaiore" con le auto di chi parte da quelle città, e le altre città restano al ritrovo principale

### Requirement: Direttamente alla partenza
Gli iscritti che hanno risposto di andare direttamente alla partenza SHALL essere elencati a parte e MUST NOT entrare nelle auto dal ritrovo.

#### Scenario: Va direttamente
- **WHEN** un iscritto risponde "Direttamente alla partenza"
- **THEN** compare in "Direttamente alla partenza" e non in un'auto dal ritrovo

### Requirement: Chi parte da dove
Per il viaggio fino al ritrovo il sistema SHALL mostrare, città per città, chi ha l'auto e chi cerca un passaggio, senza assegnare i passaggi.

#### Scenario: Città con chi cerca un passaggio
- **WHEN** da una città partono un iscritto automunito e uno senza auto
- **THEN** la città mostra il primo tra chi ha l'auto e il secondo tra chi cerca un passaggio

### Requirement: Ritrovo
Il sistema SHALL mostrare il ritrovo della scheda tecnica del percorso con lo stesso nome dell'uscita; se non c'è, SHALL mostrare "Scegli il ritrovo" senza un ritrovo predefinito. Il direttivo SHALL poterlo scegliere o cambiare tra i ritrovi abituali.

#### Scenario: Scheda senza ritrovo
- **WHEN** non c'è una scheda tecnica per l'uscita
- **THEN** il ritrovo è da scegliere e il riepilogo scrive "Ritrovo: da definire"

### Requirement: Domande nel modulo template
Lo script di automazione SHALL offrire l'operazione `aggiungi_domande_auto` (eseguibile anche dall'editor con `aggiungiDomandeAuto`) che aggiunge al form template la domanda "ritrovo o direttamente alla partenza" dopo "Città da dove parti" e la domanda sui posti dell'auto (scelta "4 posti" o "5 posti") dopo quella sul mezzo a disposizione; una domanda sui posti già presente SHALL essere portata a queste due scelte. MUST NOT aggiungere doppioni né modificare le altre domande.

#### Scenario: Domande già presenti
- **WHEN** il template ha già le due domande
- **THEN** l'operazione non modifica nulla e lo dice nel risultato

### Requirement: Correzioni condivise
Accanto a ogni auto il sistema SHALL permettere di scegliere chi guida tra chi è a bordo e può guidare; chi guidava prima resta nella stessa auto. Le scelte a mano (chi guida, posti, chi va con chi, ritrovo) SHALL essere salvate nella scheda `Auto_Escursioni` del database condiviso e SHALL restare valide quando cambiano le iscrizioni. Un pulsante SHALL annullarle tutte.

#### Scenario: Cambio di chi guida
- **WHEN** nell'auto di un iscritto viaggia un altro che può guidare e l'utente lo sceglie
- **THEN** guida il nuovo, il precedente viaggia nella stessa auto e gli altri passeggeri restano

#### Scenario: Nuova iscrizione
- **WHEN** dopo una correzione a mano arriva una nuova iscrizione
- **THEN** la correzione resta e il nuovo iscritto viene sistemato in automatico

### Requirement: Riepilogo
La sezione SHALL offrire "Copia riepilogo per il gruppo" con il ritrovo, le auto dal ritrovo, chi va direttamente alla partenza e chi parte dalla stessa città.

#### Scenario: Copia
- **WHEN** l'utente preme "Copia riepilogo per il gruppo"
- **THEN** negli appunti c'è il testo con le auto nello stesso ordine della sezione
