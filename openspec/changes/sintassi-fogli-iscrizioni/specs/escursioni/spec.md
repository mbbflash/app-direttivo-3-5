## MODIFIED Requirements

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

## ADDED Requirements

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
