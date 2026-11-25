# escursioni Specification

## Purpose
Raccoglie le iscrizioni alle escursioni dai fogli risposte dei Google Form, le abbina al Libro Soci, segnala cosa controllare prima dell'uscita, permette conferme e note condivise per partecipante e facilita le comunicazioni agli iscritti.

## Requirements

### Requirement: Elenco uscite automatico
Il sistema SHALL trovare nel Drive tutti i fogli di calcolo il cui nome segue una delle due sintassi delle uscite, `Iscrizioni AAAA.MM.GG - Nome (Risposte)` oppure `Form Iscrizione AAAA.MM.GG - "Nome" (Risposte)`, senza distinguere maiuscole e minuscole e anche per i fogli nuovi, senza configurazione. SHALL leggerne il primo foglio e ordinarli per la data dell'uscita. Le escursioni SHALL essere caricate solo quando l'utente apre la scheda Escursioni.

#### Scenario: Nuovo form creato
- **WHEN** il direttivo crea un nuovo foglio "Iscrizioni AAAA.MM.GG - …" nel Drive dell'account
- **THEN** l'uscita compare nell'elenco al successivo caricamento, senza modificare l'app

#### Scenario: Un foglio non leggibile
- **WHEN** uno dei fogli dei form non si riesce a leggere
- **THEN** quell'uscita viene segnata con l'errore e le altre si caricano normalmente

#### Scenario: Le due sintassi insieme
- **WHEN** nel Drive ci sono sia fogli "Iscrizioni 2026.11.21 - Il Monte Fiocca (Risposte)" sia fogli "Form Iscrizione 2026.10.25 - "Monte Cella" (Risposte)"
- **THEN** l'elenco li mostra tutti, in un unico ordine cronologico

#### Scenario: Prefisso senza data
- **WHEN** nel Drive c'è un foglio che inizia con "Iscrizioni" ma non è seguito da una data AAAA.MM.GG (per esempio "Iscrizioni soci 2027")
- **THEN** il foglio non compare tra le uscite

### Requirement: Lettura dei campi del form
Il sistema SHALL riconoscere nelle colonne del form nome e cognome (anche in un'unica colonna), email e telefono dal testo dell'intestazione, ignorando la colonna dell'orario di invio, e SHALL mostrare le altre risposte come informazioni aggiuntive.

#### Scenario: Colonna unica "Nome e cognome"
- **WHEN** il form ha una colonna con "nome" e "cognome" nell'intestazione
- **THEN** il sistema usa quel valore come nome del partecipante

### Requirement: Abbinamento al Libro Soci
Il sistema SHALL abbinare ogni iscritto a un socio cercando nell'ordine: email (senza distinzione di maiuscole; per Gmail ignorando punti e "+etichetta"; tutte le email presenti in una cella del Libro Soci), telefono (solo cifre, senza prefisso 39, almeno 6 cifre; tutti i numeri di una cella), nome e cognome considerati come insieme di parole (accenti, punteggiatura e ordine ignorati, almeno due parole), e infine nome parziale: tutte le parole del nome più corto (almeno due) contenute nell'altro. Un'email o un telefono condivisi da più soci non bastano a decidere. Se il nome parziale corrisponde a più soci, l'iscritto resta non abbinato. Dove c'è solo il nome (foglio statistiche), il sistema SHALL usare anche le email e i telefoni con cui quel nome compare nei moduli d'iscrizione.

#### Scenario: Nome in ordine invertito
- **WHEN** nel form c'è "Rossi Mario" e nel Libro Soci "Mario Rossi", senza email o telefono in comune
- **THEN** l'iscritto viene riconosciuto come quel socio

#### Scenario: Secondo nome o doppio cognome
- **WHEN** nel form c'è "Stefano Picchi" e nel Libro Soci l'unico socio compatibile è "Picchi Stefano Maria"
- **THEN** l'iscritto viene riconosciuto come quel socio

#### Scenario: Nome parziale ambiguo
- **WHEN** nel form c'è "Marco Rossi" e nel Libro Soci ci sono "Rossi Marco Luigi" e "Rossi Marco Antonio"
- **THEN** l'iscritto resta "Non socio"

#### Scenario: Nome delle statistiche collegato tramite email
- **WHEN** nel foglio statistiche un nome non corrisponde a nessun socio, ma nei moduli d'iscrizione lo stesso nome ha un'email presente nel Libro Soci
- **THEN** in classifica la persona viene riconosciuta come quel socio

### Requirement: Adesioni e statistiche dell'uscita
Il sistema SHALL mostrare per l'uscita scelta la tabella dei partecipanti con contatti (e collegamenti WhatsApp/Telegram), stato socio e numero di escursioni fatte, una ricerca per nome, email o telefono, e i totali: adesioni nel foglio, quanti sono già soci, partecipanti unici.

#### Scenario: Ricerca partecipante
- **WHEN** l'utente scrive un'email nella ricerca partecipanti
- **THEN** la tabella mostra solo gli iscritti che la contengono

### Requirement: Avvisi dell'uscita
Il sistema SHALL segnalare per ogni escursione gli iscritti non trovati nel Libro Soci, quelli che nel form dichiarano la tessera non attiva o che risultano SCADUTA nel Libro Soci, quelli senza email, e i soci iscritti con la tessera cartacea non ancora consegnata (indicando se è da preparare o da consegnare).

#### Scenario: Socio con tessera scaduta iscritto
- **WHEN** un iscritto è abbinato a un socio con stato SCADUTA
- **THEN** compare tra gli avvisi con "[tessera scaduta nel Libro Soci]"

### Requirement: Conferme e note condivise per partecipante
Il sistema SHALL permettere per ogni iscritto una spunta "Confermato" e una nota, salvate nel database condiviso (scheda `Conferme_Escursioni`).

#### Scenario: Conferma di un partecipante
- **WHEN** un membro del direttivo spunta "Confermato" per un iscritto
- **THEN** la conferma si salva nel database ed è visibile agli altri e nell'export

### Requirement: Comunicazioni ai partecipanti
Il sistema SHALL permettere di copiare le email di tutti gli iscritti all'uscita in CCN (senza duplicati, usando l'email del Libro Soci se manca nel form), di aprire il programma di posta con destinatari, oggetto e testo già pronti, di inviare lo stesso testo su Telegram e di copiare i modelli di testo "annullamento escursione" e "informazioni utili".

#### Scenario: Copia email in CCN
- **WHEN** l'utente preme "Copia email in CCN"
- **THEN** negli appunti finiscono gli indirizzi unici degli iscritti con un'email valida

### Requirement: Export dei partecipanti
Il sistema SHALL esportare in CSV gli iscritti all'uscita scelta con contatti, stato socio, conferme e note.

#### Scenario: Export partecipanti
- **WHEN** l'utente preme "Esporta partecipanti"
- **THEN** il sistema scarica un CSV con una riga per iscritto

### Requirement: Contatore partecipazioni
Il sistema SHALL calcolare, su tutti i fogli dei form, la classifica degli escursionisti con il numero di uscite e il loro elenco, contando ogni persona una sola volta per uscita e unendo le iscrizioni della stessa persona riconosciuta come socio. Il curriculum nella scheda socio SHALL usare questo conteggio se le statistiche non sono disponibili.

#### Scenario: Doppia iscrizione alla stessa uscita
- **WHEN** la stessa persona compare due volte nel foglio di un'uscita
- **THEN** quella uscita le viene contata una volta sola

### Requirement: Nome e data dell'uscita dal nome del foglio
Il sistema SHALL ricavare la data dell'uscita dalla data AAAA.MM.GG che segue il prefisso; per le uscite di più giorni (`AAAA.MM.GG-GG`) la data è il primo giorno. Il nome dell'uscita SHALL essere il testo tra virgolette, se presente, altrimenti il testo tra " - " e " (Risposte)". Nome e data SHALL essere gli stessi in tutta l'app: scheda Escursioni, contatore partecipazioni, curriculum, notifiche, statistiche e assistente.

#### Scenario: Sintassi nuova
- **WHEN** il foglio si chiama "Iscrizioni 2026.11.21 - Il Monte Fiocca (Risposte)"
- **THEN** l'uscita si chiama "Il Monte Fiocca" e la sua data è 21/11/2026

#### Scenario: Sintassi vecchia con virgolette
- **WHEN** il foglio si chiama "Form Iscrizione 2026.10.25 - "Monte Cella" (Risposte)"
- **THEN** l'uscita si chiama "Monte Cella" e la sua data è 25/10/2026

#### Scenario: Uscita di due giorni
- **WHEN** il foglio si chiama "Iscrizioni 2026.09.05-06 - Due giorni, Prado e Cusna (Risposte)"
- **THEN** l'uscita si chiama "Due giorni, Prado e Cusna" e la sua data è 05/09/2026

#### Scenario: Nome con trattini o apostrofi
- **WHEN** il foglio si chiama "Iscrizioni 2024.11.30 - L'acquedotto Leopoldino (Risposte)"
- **THEN** l'uscita si chiama "L'acquedotto Leopoldino"
