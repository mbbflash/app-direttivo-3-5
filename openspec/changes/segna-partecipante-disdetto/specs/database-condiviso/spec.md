## MODIFIED Requirements

### Requirement: Schema del database
Il sistema SHALL usare nel foglio database le schede `Tessere`, `Note`, `Conferme_Escursioni`, `Solleciti`, `Log` e `Richieste`, con colonne fisse, e MUST crearle con l'intestazione (riga 1 bloccata) se mancano. Se a una scheda esistente mancano in coda colonne previste (per esempio dopo un aggiornamento dell'app), il sistema SHALL aggiungerne l'intestazione senza spostare le colonne e i dati esistenti.

#### Scenario: Colonne delle schede
- **WHEN** l'app legge o scrive il database
- **THEN** usa queste colonne, nell'ordine:
  - `Tessere`: chiave, tessera, socio, preparata, consegnata, aggiornato_il, aggiornato_da
  - `Note`: chiave, tessera, socio, nota, aggiornato_il, aggiornato_da
  - `Conferme_Escursioni`: chiave, escursione, partecipante, confermato, nota, aggiornato_il, aggiornato_da, disdetto
  - `Solleciti`: chiave, tessera, socio, canale, data_sollecito, aggiornato_il, aggiornato_da
  - `Log`: quando, chi, tipo, chiave, valore
  - `Richieste`: id, tipo, parametri, stato, risultato, errore, creato_il, creato_da, completato_il

#### Scenario: Database nuovo o incompleto
- **WHEN** l'app apre il database e una delle schede non esiste
- **THEN** il sistema la crea con le intestazioni previste prima di leggere o scrivere

#### Scenario: Colonna disdetto mancante
- **WHEN** l'app legge la scheda `Conferme_Escursioni` e la cella di intestazione della colonna H è vuota
- **THEN** il sistema scrive `disdetto` in H1 e lascia invariate le altre celle

#### Scenario: Righe scritte da una versione precedente
- **WHEN** una riga di `Conferme_Escursioni` non ha valore nella colonna `disdetto`
- **THEN** il sistema considera l'iscritto non disdetto
