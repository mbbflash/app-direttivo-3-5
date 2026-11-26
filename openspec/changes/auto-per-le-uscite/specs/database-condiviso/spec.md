## MODIFIED Requirements

### Requirement: Schema del database
Il sistema SHALL usare nel foglio database le schede `Tessere`, `Note`, `Conferme_Escursioni`, `Solleciti`, `Log`, `Richieste` e `Auto_Escursioni`, con colonne fisse, e MUST crearle con l'intestazione (riga 1 bloccata) se mancano.

#### Scenario: Colonne delle schede
- **WHEN** l'app legge o scrive il database
- **THEN** usa queste colonne, nell'ordine:
  - `Tessere`: chiave, tessera, socio, preparata, consegnata, aggiornato_il, aggiornato_da
  - `Note`: chiave, tessera, socio, nota, aggiornato_il, aggiornato_da
  - `Conferme_Escursioni`: chiave, escursione, partecipante, confermato, nota, aggiornato_il, aggiornato_da
  - `Solleciti`: chiave, tessera, socio, canale, data_sollecito, aggiornato_il, aggiornato_da
  - `Log`: quando, chi, tipo, chiave, valore
  - `Richieste`: id, tipo, parametri, stato, risultato, errore, creato_il, creato_da, completato_il
  - `Auto_Escursioni`: chiave, escursione, impostazioni, aggiornato_il, aggiornato_da

#### Scenario: Database nuovo o incompleto
- **WHEN** l'app apre il database e una delle schede non esiste
- **THEN** il sistema la crea con le intestazioni previste prima di leggere o scrivere
