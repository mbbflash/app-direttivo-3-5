## Context

Il foglio delle schede tecniche ha una riga per uscita con le colonne: Anno, Escursione, Difficoltà, Lunghezza, Durata, Dislivello, Quota Max, Quota Min, Partenza/Arrivo, Ritrovo Principale, Descrizione. I valori sono testo libero ("5,2 km", "5.30 h con pause", "900 m (+500 m / +400 m)", "Medio-Difficile", "Facile (discesa impegnativa)"). Lo stesso percorso può comparire in più anni.

## Goals / Non-Goals

**Goals:** proposte motivate in pochi secondi, senza nuovi servizi né chiavi; dati sempre letti dal foglio, che resta modificabile a mano.

**Non-Goals:** IA generativa, meteo, scrittura nei fogli, pianificazione del calendario.

## Decisions

- **Ricerca per prefisso** del nome del foglio (come per i "Form Iscrizione"), perché il titolo contiene gli anni; se ce ne sono più di uno si usa quello dell'account modificato più di recente.
- **Parsing tollerante**: si prende il primo numero di ogni campo; la durata "5.30 h" vale 5,5 ore; la difficoltà si porta su una scala 1-5 (Facile 1, Medio-Facile 2, Medio 3, Medio+ 3,5, Medio-Difficile 4, Difficile 5) cercando le parole nel testo.
- **Percorsi unificati** per nome normalizzato (parole senza articoli/preposizioni, ordine ignorato): si usano i dati dell'anno più recente.
- **Abbinamento a presenze e form** per somiglianza delle parole significative del nome (≥ 60% di parole in comune o nome contenuto nell'altro): i nomi nel foglio statistiche e nei form non sono sempre identici.
- **Punteggio a regole** (base 50, limitato 0-100), ogni regola aggiunge una motivazione leggibile:
  - stagione: quota massima > 1500 m tra dicembre e marzo −30 (neve), > 1200 m in quei mesi −10; quota massima < 700 m tra giugno e agosto −20 (caldo), > 1300 m d'estate +10; < 1000 m d'inverno +5;
  - ultima volta: mai registrato +10; da ≥ 24 mesi +15; 12-24 mesi +5; < 12 mesi −25 (o escluso se richiesto);
  - partecipazione: presenze medie sopra la media generale fino a +15, sotto fino a −10;
  - varietà: difficoltà diversa dall'ultima uscita fatta +5; stessa difficoltà delle ultime due −5.
- **Filtri rigidi** (difficoltà, dislivello, durata, ritrovo, recenti) escludono; i percorsi già in un form futuro sono esclusi con la nota "già in programma".
- Le fonti presenze e form sono facoltative: se non si caricano l'assistente funziona con la sola colonna Anno.

## Risks / Trade-offs

- Nomi molto diversi tra i fogli → abbinamento mancato: la proposta mostra "nessuna presenza registrata"; il direttivo può uniformare i nomi.
- La descrizione nel foglio è già troncata ("…"): l'annuncio la riporta così com'è.
