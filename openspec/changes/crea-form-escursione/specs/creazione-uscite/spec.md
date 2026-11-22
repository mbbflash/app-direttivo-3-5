## Purpose

Permette al direttivo di creare dall'app una nuova escursione programmata: form di iscrizione clonato dal template e foglio risposte collegato, con i nomi nelle sintassi che l'app riconosce.

## ADDED Requirements

### Requirement: Pulsante nuova escursione
La scheda Escursioni SHALL offrire il pulsante "Nuova escursione programmata (Crea Form + Foglio risposte)". Il pulsante SHALL chiedere il nome dell'escursione e la data, e facoltativamente una data di fine per le uscite di più giorni, e SHALL inviare la richiesta di creazione allo script di automazione.

#### Scenario: Richiesta di creazione
- **WHEN** l'utente inserisce "giro di prova" e 22/11/2026 e conferma
- **THEN** l'app invia allo script una richiesta di creazione con quei dati e ne mostra lo stato

#### Scenario: Nome mancante
- **WHEN** l'utente conferma senza nome o con una data non valida
- **THEN** l'app non invia la richiesta e indica il campo da correggere

### Requirement: Controlli prima della creazione
Prima di inviare la richiesta, l'app SHALL avvisare se esiste già un'uscita con la stessa data e lo stesso nome (senza distinguere maiuscole e minuscole) e in quel caso MUST NOT inviarla. Se la data è nel passato, l'app SHALL chiedere conferma.

#### Scenario: Uscita già esistente
- **WHEN** esiste già il foglio "Iscrizioni 2026.11.22 - Giro di prova (Risposte)" e l'utente chiede "giro di prova" il 22/11/2026
- **THEN** l'app avvisa che l'uscita esiste già e non crea nulla

#### Scenario: Data passata
- **WHEN** l'utente inserisce una data precedente a oggi
- **THEN** l'app chiede conferma e invia la richiesta solo se l'utente conferma

### Requirement: Form clonato dal template
Lo script SHALL copiare il form `[TEMPLATE] Form Iscrizione aaaa.mm.gg - "Nome Escursione"`, trovato per nome, nella stessa cartella del template. SHALL chiamare la copia `Form iscrizione AAAA.MM.GG - "Nome"` e SHALL impostarne il titolo `✒️ Nome - <giorno della settimana> GG/MM/AAAA`, con il giorno in italiano e in minuscolo. Tutto il resto del template MUST restare invariato e il template MUST NOT essere modificato.

#### Scenario: Uscita di un giorno
- **WHEN** lo script crea "giro di prova" del 22/11/2026
- **THEN** il form si chiama `Form iscrizione 2026.11.22 - "giro di prova"` e il titolo è `✒️ giro di prova - domenica 22/11/2026`
- **AND** descrizione, domande, sezioni, impostazioni e messaggio di conferma sono quelli del template

#### Scenario: Uscita di due giorni
- **WHEN** lo script crea "Prado e Cusna" dal 05/09/2026 al 06/09/2026
- **THEN** il form si chiama `Form iscrizione 2026.09.05-06 - "Prado e Cusna"` e il titolo è `✒️ Prado e Cusna - sabato 05/09 e domenica 06/09/2026`

#### Scenario: Template non trovato
- **WHEN** nel Drive non esiste un form con il nome del template, oppure ne esiste più di uno
- **THEN** la richiesta finisce in errore con un messaggio che indica il nome del template atteso

### Requirement: Foglio risposte collegato
Lo script SHALL creare il foglio `Iscrizioni AAAA.MM.GG - Nome (Risposte)` (con `AAAA.MM.GG-GG` per più giorni) nella stessa cartella del form e SHALL collegarlo al nuovo form come destinazione delle risposte. Se esiste già un foglio o un form con lo stesso nome, la richiesta SHALL finire in errore senza creare nulla.

#### Scenario: Foglio creato e collegato
- **WHEN** lo script ha creato il form "giro di prova" del 22/11/2026
- **THEN** esiste il foglio `Iscrizioni 2026.11.22 - giro di prova (Risposte)`, collegato al form
- **AND** al successivo caricamento l'uscita compare nella scheda Escursioni

#### Scenario: Nome già usato nel Drive
- **WHEN** nel Drive esiste già un file con il nome del form o del foglio da creare
- **THEN** la richiesta finisce in errore con il nome del file in conflitto e non viene creato nessun file

### Requirement: Risultato della creazione
A creazione completata, l'app SHALL mostrare il link per compilare il form, con il pulsante "Copia link", e il link per modificarlo. SHALL anche ricaricare l'elenco delle uscite.

#### Scenario: Form pronto
- **WHEN** la richiesta di creazione passa a `fatto`
- **THEN** l'app mostra "Form pronto" con "Copia link" (link da compilare) e "Apri il form" (link di modifica)
- **AND** la nuova uscita compare nell'elenco delle escursioni

### Requirement: Creazione simulata in demo
In modalità demo (`?demo=1`), la creazione SHALL essere simulata senza chiamare Google: dopo pochi secondi la richiesta risulta completata e la nuova uscita compare tra quelle demo.

#### Scenario: Prova in demo
- **WHEN** l'utente crea un'escursione in `?demo=1`
- **THEN** vede gli stessi passaggi e lo stesso risultato della versione vera, con link finti, e nessun dato reale viene toccato
