## MODIFIED Requirements

### Requirement: Fogli in sola lettura
Il sistema MUST NOT scrivere nel Libro Soci ("2 - Libro Soci e Volontari", scheda "Libro Soci", colonne A:AZ), nei fogli risposte delle escursioni ("Iscrizioni AAAA.MM.GG - …" oppure "Form Iscrizione AAAA.MM.GG - …", primo foglio, colonne A:AZ), nel foglio "3 - Modulo Iscrizione Tre Quinti Trekking APS (Risposte)", di cui SHALL leggere solo le colonne F:J, né nel foglio delle schede tecniche "Tre Quinti Trekking - Schede Tecniche Escursioni …", di cui SHALL leggere solo il primo foglio, colonne A:K.

#### Scenario: Libro Soci in sola lettura
- **WHEN** l'utente lavora sui soci (spunte, note, solleciti)
- **THEN** il sistema non scrive mai nel Libro Soci né nei fogli dei Form, ma solo nel database condiviso

#### Scenario: Schede tecniche in sola lettura
- **WHEN** l'utente usa l'assistente alla scelta della prossima escursione
- **THEN** il sistema legge le schede tecniche senza mai modificarle
