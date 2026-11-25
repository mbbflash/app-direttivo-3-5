## ADDED Requirements

### Requirement: Iscritto disdetto
Il sistema SHALL permettere di segnare un iscritto all'uscita selezionata come "Disdetto" e di annullare la disdetta, salvando lo stato nel database condiviso (scheda `Conferme_Escursioni`) con la stessa chiave usata per conferma e nota. Il sistema MUST NOT cancellare né modificare la riga nel foglio risposte del modulo. Un iscritto disdetto SHALL comparire barrato in fondo alla tabella delle adesioni, con l'etichetta "Disdetto" e il comando per annullare la disdetta. Segnare un iscritto come disdetto SHALL togliere la sua spunta "Confermato" e lasciare la nota.

#### Scenario: Segnare una disdetta
- **WHEN** un membro del direttivo preme "Disdetto" su un iscritto
- **THEN** l'iscritto compare barrato in fondo all'elenco con l'etichetta "Disdetto" e la spunta "Confermato" tolta
- **AND** la disdetta si salva nel database ed è visibile agli altri membri del direttivo
- **AND** la riga nel foglio risposte del modulo resta invariata

#### Scenario: Annullare una disdetta
- **WHEN** un membro del direttivo preme "Annulla disdetta" su un iscritto disdetto
- **THEN** l'iscritto torna nell'elenco come gli altri e conta di nuovo nei totali

#### Scenario: Stessa persona iscritta due volte
- **WHEN** la stessa persona compare due volte nel foglio di un'uscita e viene segnata come disdetta
- **THEN** entrambe le righe risultano disdette

### Requirement: Disdetti esclusi da conteggi e comunicazioni
Il sistema MUST escludere gli iscritti disdetti da: adesioni nel foglio e soci nel riepilogo dell'uscita, numero di confermati, avvisi dell'uscita, email copiate in CCN o inviate con il programma di posta, export dei partecipanti e contatore partecipazioni (colonna "N° escursioni", riquadro "Escursionisti unici", curriculum dai form). Il riepilogo SHALL indicare quanti sono i disdetti quando ce ne sono.

#### Scenario: Riepilogo con un disdetto
- **WHEN** un'uscita ha 10 righe nel foglio e 1 iscritto è disdetto
- **THEN** il riepilogo mostra 9 adesioni e indica 1 disdetto

#### Scenario: CCN senza disdetti
- **WHEN** l'utente preme "Copia email in CCN" per un'uscita con un iscritto disdetto
- **THEN** l'email del disdetto non è tra quelle copiate

#### Scenario: Export senza disdetti
- **WHEN** l'utente preme "Esporta partecipanti"
- **THEN** il CSV non contiene gli iscritti disdetti

#### Scenario: Contatore senza l'uscita disdetta
- **WHEN** una persona ha disdetto un'uscita a cui era iscritta
- **THEN** quell'uscita non conta nel suo numero di escursioni fatte

### Requirement: Email di conferma della disdetta
Il sistema SHALL offrire su ogni iscritto disdetto il comando "Email di conferma", che apre il programma di posta con destinatario l'email dell'iscritto (quella del form o, se manca, quella del Libro Soci), oggetto e testo già pronti in italiano con nome e data dell'uscita. Il sistema MUST NOT inviare email da solo: l'invio lo fa l'utente dal suo programma di posta. Se l'iscritto non ha un'email valida, il comando SHALL essere disattivato con la spiegazione del motivo.

#### Scenario: Email di conferma
- **WHEN** l'utente preme "Email di conferma" su un iscritto disdetto con email
- **THEN** si apre il programma di posta con destinatario l'iscritto, oggetto "Disdetta escursione «<nome uscita>» del <gg/mm/aaaa>" e il testo di conferma con il nome dell'iscritto

#### Scenario: Iscritto senza email
- **WHEN** un iscritto disdetto non ha email né nel form né nel Libro Soci
- **THEN** il comando "Email di conferma" è disattivato e indica che manca l'email
