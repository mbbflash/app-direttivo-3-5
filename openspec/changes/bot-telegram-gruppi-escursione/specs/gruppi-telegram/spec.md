## Purpose

Guida il direttivo, nella scheda Escursioni, a creare e collegare il gruppo Telegram di ogni uscita. Mostra a chi è arrivato l'invito e prepara l'email in CCN con il link per chi non l'ha ricevuto su Telegram.

## ADDED Requirements

### Requirement: Guida passo passo per il gruppo dell'uscita
Per ogni uscita non ancora passata, la scheda Escursioni SHALL mostrare il punto in cui si trova il gruppo Telegram e il passo successivo: crea il gruppo, aggiungi il bot come amministratore, abbina il gruppo all'uscita, inviti in corso, email da mandare, tutto fatto. Per il primo passo SHALL suggerire il nome del gruppo, con un pulsante per copiarlo.

#### Scenario: Uscita nuova senza gruppo
- **WHEN** l'utente apre un'uscita futura che non ha un gruppo abbinato
- **THEN** l'app mostra "1. Crea il gruppo Telegram" con il nome suggerito "Tre Quinti - <nome uscita> <GG/MM>" e il pulsante "Copia nome"
- **AND** mostra come passo 2 "Aggiungi @<bot> al gruppo come amministratore"

#### Scenario: Uscita passata
- **WHEN** l'uscita selezionata ha una data già passata
- **THEN** l'app non propone la guida, ma mostra il gruppo abbinato se c'è

### Requirement: Segnalazione delle uscite senza gruppo
L'app SHALL segnalare con un avviso nella scheda Escursioni le uscite future che non hanno ancora un gruppo abbinato.

#### Scenario: Nuovo form creato
- **WHEN** compare un nuovo foglio "Iscrizioni AAAA.MM.GG - …" con data futura e nessun gruppo abbinato
- **THEN** l'app mostra "Uscite senza gruppo Telegram: <nome>" con il collegamento alla guida di quell'uscita

### Requirement: Abbinamento gruppo e uscita
L'app SHALL elencare i gruppi registrati dal bot e non ancora abbinati, e SHALL permettere di abbinarne uno all'uscita selezionata, con conferma. Un gruppo SHALL essere abbinato a una sola uscita. L'abbinamento SHALL poter essere tolto.

#### Scenario: Abbinamento
- **WHEN** il bot ha registrato il gruppo "Tre Quinti - Monte Fiocca 21/11" e l'utente lo abbina all'uscita "Il Monte Fiocca"
- **THEN** l'abbinamento si salva nel database e il bot inizia a mandare gli inviti al controllo successivo

#### Scenario: Bot non amministratore
- **WHEN** il gruppo da abbinare risulta "bot non amministratore"
- **THEN** l'app permette l'abbinamento ma avvisa che gli inviti partiranno solo dopo aver nominato il bot amministratore

### Requirement: Stato degli inviti per iscritto
Per l'uscita abbinata, l'app SHALL mostrare per ogni iscritto lo stato Telegram (inviato su Telegram, da mandare via email, email inviata, entrato, in attesa del bot) e i totali per stato.

#### Scenario: Riepilogo dell'uscita
- **WHEN** l'utente apre un'uscita abbinata con 25 iscritti
- **THEN** vede per esempio "18 inviati su Telegram · 5 da email · 2 entrati" e lo stato accanto a ogni iscritto

### Requirement: Email con il link condiviso
L'app SHALL offrire "Email con il link del gruppo": prepara un'email in CCN con il link condiviso dell'uscita, destinata solo agli iscritti "da mandare via email" che hanno un indirizzo email. Dopo l'invio l'utente SHALL poter segnare quegli iscritti come "email inviata".

#### Scenario: Email solo a chi serve
- **WHEN** 5 iscritti sono "da mandare via email" e 18 "inviati su Telegram"
- **THEN** l'email in CCN contiene solo i 5 indirizzi e il testo con il link condiviso e l'invito a scrivere al bot

#### Scenario: Iscritto senza email
- **WHEN** un iscritto "da mandare via email" non ha un indirizzo email
- **THEN** l'app lo elenca a parte come "da contattare a mano", con i collegamenti WhatsApp e Telegram già presenti

### Requirement: Richieste di accesso da decidere
L'app SHALL mostrare per l'uscita le richieste di accesso al gruppo che il bot non ha potuto approvare (numero non condiviso o non iscritto), con nome Telegram e motivo, e l'indicazione di approvarle o rifiutarle da Telegram.

#### Scenario: Persona non iscritta
- **WHEN** il bot ha lasciato in attesa la richiesta di una persona non presente nel foglio
- **THEN** l'app mostra "Richieste da decidere in Telegram: <nome Telegram> (non iscritto)"

### Requirement: Collegamento nella scheda socio
La scheda socio SHALL indicare "collegato a Telegram" quando il cellulare del socio coincide con un numero collegato e attivo.

#### Scenario: Socio collegato
- **WHEN** il cellulare di un socio, normalizzato, è tra i collegamenti attivi
- **THEN** la scheda socio mostra "collegato a Telegram"

### Requirement: Gruppi simulati in demo
In modalità demo (`?demo=1`) l'app SHALL simulare gruppi registrati, collegamenti e stati degli inviti con dati inventati, senza chiamare Google né Telegram.

#### Scenario: Prova della guida in demo
- **WHEN** l'utente percorre la guida in `?demo=1`
- **THEN** vede tutti i passi fino a "tutto fatto" con dati finti
