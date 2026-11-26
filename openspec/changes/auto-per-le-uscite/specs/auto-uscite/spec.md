## Purpose

Propone in automatico le auto che partono dal punto di ritrovo verso la partenza dell'escursione, dalle risposte del modulo d'iscrizione, e mostra chi parte da quale città per accordarsi sul viaggio fino al ritrovo. Le correzioni a mano sono condivise con il direttivo.

## ADDED Requirements

### Requirement: Dati dal modulo
Il sistema SHALL ricavare per ogni iscritto non disdetto la città (domanda "da dove parti"), se può guidare (sì sia a "automunito" sia a "mezzo a disposizione") e i compagni di viaggio (domanda "con chi sei in auto", abbinati solo se il nome corrisponde a un unico iscritto).

#### Scenario: Compagno di viaggio
- **WHEN** un iscritto scrive "Marco" e un solo altro iscritto si chiama Marco
- **THEN** i due risultano compagni di viaggio

### Requirement: Domande facoltative
Il sistema SHALL considerare tutte le auto da 5 posti (chi guida e 4 passeggeri) e SHALL leggere chi va direttamente alla partenza dalla domanda "ci vediamo al punto di ritrovo o vai direttamente alla partenza". Se la domanda manca, SHALL considerare tutti al ritrovo.

#### Scenario: Domande nuove assenti
- **WHEN** il foglio dell'uscita non ha la domanda sul ritrovo
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

### Requirement: Direttamente alla partenza
Gli iscritti che hanno risposto di andare direttamente alla partenza SHALL essere elencati a parte e MUST NOT entrare nelle auto dal ritrovo.

#### Scenario: Va direttamente
- **WHEN** un iscritto risponde "Direttamente alla partenza"
- **THEN** compare in "Direttamente alla partenza" e non in un'auto dal ritrovo

### Requirement: Ritrovo
Il sistema SHALL mostrare il ritrovo della scheda tecnica del percorso con lo stesso nome dell'uscita; se non c'è, SHALL mostrare "Scegli il ritrovo" senza un ritrovo predefinito. Il direttivo SHALL poterlo scegliere o cambiare tra i ritrovi abituali.

#### Scenario: Scheda senza ritrovo
- **WHEN** non c'è una scheda tecnica per l'uscita
- **THEN** il ritrovo è da scegliere e il riepilogo scrive "Ritrovo: da definire"

### Requirement: Domande nel modulo template
Lo script di automazione SHALL offrire l'operazione `aggiungi_domande_auto` (eseguibile anche dall'editor con `aggiungiDomandeAuto`) che aggiunge al form template la domanda "ritrovo o direttamente alla partenza" dopo "Città da dove parti" . MUST NOT aggiungere doppioni né modificare le altre domande.

#### Scenario: Domande già presenti
- **WHEN** il template ha già le due domande
- **THEN** l'operazione non modifica nulla e lo dice nel risultato

### Requirement: Schermata dell'uscita
La sezione SHALL mostrare solo il ritrovo, le auto (chi guida, eventuale "parte da …", passeggeri), chi è senza posto, chi va direttamente alla partenza e il pulsante "Copia per il gruppo". Ogni nome SHALL aprire la scheda del partecipante.

#### Scenario: Apertura della scheda
- **WHEN** l'utente tocca un nome nella sezione
- **THEN** si apre la scheda di quel partecipante

### Requirement: Scheda del partecipante
La scheda SHALL permettere di impostare il ritrovo abituale e il passaggio abituale (chi lo passa a prendere), validi per tutte le uscite e salvati nella scheda `Auto_Escursioni` con la chiave `_persone`, e la scelta "solo per questa uscita" (come al solito, guida, non guida, con un'auto), salvata con l'uscita. Per i soci gli stessi ritrovo e passaggio abituali SHALL potersi impostare anche dalla pagina del socio.

#### Scenario: Passaggio abituale
- **WHEN** nella scheda di un partecipante si sceglie "con Bruno" come passaggio abituale e Bruno mette l'auto a disposizione
- **THEN** in ogni uscita in cui sono iscritti tutti e due il partecipante viaggia nell'auto di Bruno e parte da dove parte Bruno

#### Scenario: Ritrovo abituale
- **WHEN** un partecipante ha "Pisa" come ritrovo abituale
- **THEN** le sue auto si formano con gli altri che si ritrovano a Pisa e la sezione indica "parte da Pisa"

#### Scenario: Solo per questa uscita
- **WHEN** per un'uscita si sceglie "con Pietro"
- **THEN** il partecipante viaggia con Pietro solo in quell'uscita e le abitudini restano

### Requirement: Riepilogo
La sezione SHALL offrire "Copia per il gruppo" con il ritrovo, le auto (con "parte da …" se c'è), chi va direttamente alla partenza e chi è senza posto.

#### Scenario: Copia
- **WHEN** l'utente preme "Copia per il gruppo"
- **THEN** negli appunti c'è il testo con le auto nello stesso ordine della sezione

### Requirement: Scelte delle versioni precedenti
Il sistema SHALL trasformare le scelte salvate dalle versioni 2.6 (correzioni a mano per uscita, passaggi abituali, ritrovi intermedi per città) in scelte "solo per questa uscita" e in abitudini della scheda del partecipante, e SHALL poi cancellare le vecchie, così che nessuna scelta resti attiva senza essere visibile.

#### Scenario: Vecchia correzione
- **WHEN** un'uscita ha una correzione a mano salvata con la 2.6 ("Claudia con Luca")
- **THEN** la scheda di Claudia mostra "Solo per questa uscita: con Luca"

### Requirement: Ritrovo intermedio senza auto
Se in un ritrovo intermedio nessuno può guidare, il sistema SHALL portare quelle persone al ritrovo principale e la loro scheda SHALL dirlo.

#### Scenario: Nessuno guida da Camaiore
- **WHEN** l'unica persona con ritrovo abituale Camaiore non ha l'auto
- **THEN** viaggia dal ritrovo principale e la scheda indica che a Camaiore nessuno può guidare

### Requirement: Dal ritrovo intermedio in poi
Le auto formate in un ritrovo intermedio SHALL proseguire con le stesse persone fino alla partenza. Di base passano dal ritrovo principale, dove i loro posti liberi SHALL essere usati prima di aggiungere altre auto; per ogni ritrovo intermedio il direttivo SHALL poter scegliere "direttamente alla partenza".

#### Scenario: Posti liberi da Pisa
- **WHEN** un'auto parte da Pisa con 2 persone e ha 5 posti
- **THEN** al ritrovo principale ci salgono fino a 3 persone, e chi era a bordo da Pisa resta nella stessa auto

### Requirement: Compagno abituale e suggerimenti
Nella scheda il compagno di viaggio abituale SHALL potersi cercare scrivendo il nome. Il compagno abituale SHALL valere in automatico solo quando la persona si iscrive dalla stessa città da cui è stato impostato; altrimenti SHALL essere solo suggerito. La scheda SHALL suggerire anche chi ha l'auto e parte dallo stesso comune o entro 10 km (posizioni approssimate dei paesi).

#### Scenario: Iscritta da un'altra città
- **WHEN** il compagno abituale di Carla è stato impostato quando partiva da Viareggio e oggi parte da Lucca
- **THEN** non viene applicato da solo e compare tra i suggeriti

### Requirement: Suggerimenti in vista
La sezione SHALL mostrare al massimo tre suggerimenti "X potrebbe andare con Y" per chi non ha l'auto né un compagno abituale, con chi può guidare dallo stesso comune o entro 10 km. "Accetta" SHALL rendere Y il compagno abituale di X; "✕" SHALL nascondere il suggerimento per quell'uscita.

#### Scenario: Accetta
- **WHEN** l'utente tocca "Accetta" su "Anna potrebbe andare con Bruno"
- **THEN** Bruno diventa il compagno abituale di Anna e le auto si ricalcolano

### Requirement: Rifai da capo
La sezione SHALL offrire "Rifai da capo", che toglie le scelte fatte solo per quell'uscita senza toccare le abitudini.

#### Scenario: Rifai da capo
- **WHEN** l'utente conferma "Rifai da capo"
- **THEN** le scelte "solo per questa uscita" spariscono e le abitudini restano

### Requirement: Auto stabili
Dopo una modifica fatta nella sezione o nella scheda, il sistema SHALL salvare con l'uscita chi guida e chi è in quale auto, e SHALL ripartire da lì: restano alla guida gli stessi e ognuno nella sua auto, salvo quello che la modifica cambia. Nuove iscrizioni e disdette SHALL essere sistemate attorno. "Rifai da capo" SHALL togliere anche questo.

#### Scenario: Una modifica sola
- **WHEN** il direttivo imposta il ritrovo di Bruno a Pisa
- **THEN** chi guidava dal ritrovo principale continua a guidare e gli altri restano nelle loro auto, tranne chi viaggiava con Bruno

### Requirement: Priorità alla guida
La scheda del partecipante, e la pagina del socio, SHALL avere la spunta "Ha la priorità alla guida", valida per tutte le uscite. Quando servono auto, il sistema SHALL scegliere prima chi ha la spunta, tra chi può guidare.

#### Scenario: Priorità
- **WHEN** Pietro ha la spunta e servono 3 auto tra 5 persone che possono guidare
- **THEN** Pietro è tra quelli che guidano

### Requirement: Risposte ripetute e righe vuote
Se una persona compila il modulo più volte, il sistema SHALL usare la sua ultima risposta. Le righe del foglio senza nome e senza città MUST NOT contare come iscritti.

#### Scenario: Due risposte
- **WHEN** Anna risponde prima "senza auto" e poi "automunita e disponibile"
- **THEN** per le auto vale la seconda risposta

### Requirement: Vista in due tappe
Quando almeno un punto intermedio ha auto che passano dal ritrovo principale, il sistema SHALL mostrare per ogni punto intermedio solo chi si trova lì e, sotto il titolo "In partenza da <ritrovo principale>", tutte le auto che partono dal ritrovo principale con la composizione completa e i posti occupati. Il testo "Copia per il gruppo" MUST seguire la stessa struttura.

#### Scenario: Auto da Pisa e dal ritrovo principale
- **WHEN** Bruno parte da Pisa con Anna e al ritrovo principale salgono altre due persone
- **THEN** sotto "Si trovano a Pisa" c'è l'auto di Bruno con Anna, e sotto "In partenza da" c'è l'auto di Bruno con tutte e quattro le persone, insieme alle auto che partono dal ritrovo principale

