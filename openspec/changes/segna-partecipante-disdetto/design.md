## Context

Vedi `proposal.md` per il motivo. Oggi conferma e nota di un iscritto stanno nella scheda
`Conferme_Escursioni` del database condiviso (colonne A:G), con chiave
`<id foglio form>::<chiave persona>`; la coda delle modifiche (`clouddb.js`) scrive una riga
per chiave e aggiunge una voce in `Log`. I fogli risposte delle uscite sono solo letti.
Totali, avvisi, CCN, export e contatore partecipazioni partono tutti da `esc.rows`.

## Goals / Non-Goals

**Goals:**
- Disdetta reversibile, condivisa e registrata nel `Log`, senza scrivere nei fogli dei form.
- Compatibilità con le versioni precedenti ancora aperte sui dispositivi del direttivo.
- Nessuna richiesta Google in più nell'uso normale.

**Non-Goals:**
- Filtro per nascondere del tutto i disdetti (restano visibili, barrati, in fondo).
- Gestione della disdetta nel foglio statistiche.

## Decisions

1. **Colonna `disdetto` in coda (H) a `Conferme_Escursioni`**, valori SI/NO.
   Alternative scartate: una scheda nuova (`Disdette`) richiederebbe un'altra lettura e un
   altro tipo in coda; codificare la disdetta in `confermato` o nella nota romperebbe le
   versioni precedenti e l'export. In coda la colonna non sposta nulla: le versioni vecchie
   scrivono A:G e lasciano intatta la H.
2. **Intestazione aggiunta alla lettura**: la lettura del database già comprende la scheda;
   l'intervallo passa a A1:H e, se H1 è vuota, si scrive `disdetto` una volta sola
   (una richiesta, solo la prima volta). Niente controllo in più a ogni avvio.
3. **Stesso valore in coda**: l'oggetto salvato diventa `{ confirmed, note, cancelled }`;
   la lettura considera "presente" una riga se ha conferma, nota o disdetta. Il `Log`
   riporta `disdetto=SI/NO`.
4. **Un solo filtro "iscritti attivi"**: una funzione che, data un'uscita, restituisce le
   righe non disdette, usata da riepilogo, `analyzeEscursione` (avvisi e CCN), export,
   contatore partecipazioni e "Aggiungi al foglio statistiche". La tabella delle adesioni
   usa tutte le righe e mette i disdetti in fondo.
5. **Cache del contatore**: oggi si invalida quando cambia l'elenco delle uscite; deve
   invalidarsi anche quando cambia una disdetta (contatore di versione delle disdette o
   invalidazione esplicita al cambio).
6. **Comando nella riga**: pulsante piccolo "Disdetto" accanto a "Confermato"; nella riga
   disdetta diventa "Annulla disdetta". Segnare la disdetta toglie la conferma. Niente
   finestra di conferma: l'azione si annulla con un clic.

7. **Email di conferma con `mailto:`**, come il sollecito di rinnovo: destinatario l'email del
   form o del Libro Soci, oggetto `Disdetta escursione «<nome>» del <data>`, testo:
   "Ciao <nome>, ti confermiamo che abbiamo ricevuto la tua disdetta per l'escursione
   «<nome>» del <data>. Speriamo di vederti presto alle prossime uscite! Un saluto, il
   Direttivo Tre Quinti Trekking APS". Nessun dato nuovo nel database e nessuna richiesta
   Google. Alternativa scartata: invio tramite Gmail API, che richiederebbe un permesso in
   più per l'account condiviso e toglierebbe all'utente la possibilità di rileggere.

## Risks / Trade-offs

- [Un dispositivo con la versione vecchia salva una conferma su un disdetto] → la colonna H
  resta SI, quindi l'iscritto resta disdetto: nessuna perdita, al più una conferma ignorata.
- [Chiave persona cambiata dopo un aggiornamento del Libro Soci (per esempio iscritto
  abbinato a un socio dopo)] → la disdetta, come conferma e nota oggi, non si ritrova; si
  ri-segna. Rischio già accettato per le conferme.
- [Sul dispositivo non è configurato un programma di posta] → `mailto:` non apre niente;
  stesso limite già accettato per il sollecito di rinnovo.
- [Presenza del disdetto già registrata nel foglio statistiche] → va tolta a mano; lo dice
  la nota di versione.

## Migration Plan

- Nessuna migrazione dati: le righe esistenti senza H valgono "non disdetto".
- Rilascio con i passi del progetto (versione, `?v=`, cache, `version.json`). In caso di
  problemi: `git revert` e nuova versione; la colonna H può restare nel foglio senza danni.
