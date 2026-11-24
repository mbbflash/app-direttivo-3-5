# CLAUDE.md — regole del progetto APP Direttivo 3/5

Questo file vale per **chiunque** lavori al progetto con Claude Code. Claude lo legge
automaticamente a ogni sessione: le regole qui sotto vanno seguite sempre, senza che
l'utente debba ripeterle.

Rispondi all'utente **in italiano**.

## 1. Prima configurazione (una volta sola, per ogni collaboratore)

1. Clona il repository e apri la cartella con Claude Code.
2. Installa la CLI di OpenSpec (serve Node.js):
   ```powershell
   npm install -g @fission-ai/openspec@2.1.1
   ```
   Verifica con `openspec --version` (stessa versione usata finora: 2.1.1).
3. Le skill OpenSpec sono già nel repository in `.claude/skills/` (propose, explore,
   apply, update, sync, archive): non serve `openspec init`, **non** rilanciarlo.
4. Per provare l'app in locale c'è `.claude/launch.json` (server `docs` su porta 8000,
   richiede Python).

## 2. Si lavora con OpenSpec

Ogni modifica che cambia il comportamento dell'app passa da OpenSpec:

1. **Esplora** (facoltativo): `/openspec-explore` per ragionare sull'idea.
2. **Proponi**: `/openspec-propose` → crea `proposal.md`, `design.md`, `specs/`, `tasks.md`
   in `openspec/changes/<nome-modifica>/`.
3. **Implementa**: `/openspec-apply-change` segue `tasks.md` spuntando le attività.
4. **Aggiorna** il piano se cambia qualcosa: `/openspec-update-change` (mai lasciare
   proposta, design, spec e attività in disaccordo col codice).
5. **Archivia** a lavoro finito: `/openspec-archive-change` (aggiorna `openspec/specs/`).

Le specifiche correnti sono in `openspec/specs/`: leggile prima di toccare un'area.
Piccole correzioni (refusi, un bug evidente) possono andare senza proposta, ma se
cambiano un requisito va aggiornata la spec corrispondente.

**Il contesto completo del progetto e le regole per gli artefatti sono in
[`openspec/config.yaml`](openspec/config.yaml)**: è la fonte di verità, leggilo all'inizio
di ogni lavoro. Riassunto delle regole per gli artefatti:

- Tutti gli artefatti in **italiano**; titoli strutturali OpenSpec e parole chiave
  SHALL/MUST restano in inglese.
- **Proposta**: indica sempre quali fogli Google vengono letti o scritti, se cambia lo
  schema del database condiviso, e cosa resta fuori dalla modifica.
- **Design**: niente nuove dipendenze, framework o build step senza motivazione
  esplicita; considera il limite di richieste Google condiviso da tutto il direttivo
  (stesso account).
- **Attività**: includi la prova in modalità demo (`?demo=1`) e, se servono dati veri,
  la prova con login; includi i passi di rilascio (vedi §4).

## 3. Vincoli che non si violano mai

- **Repository pubblico**: mai ID dei fogli Google, URL privati, dati personali dei soci
  (nomi, email, telefoni…) nel codice, nelle spec, nelle proposte, nei commit o negli
  esempi. I fogli si trovano **per nome** (nomi in `docs/js/config.js`). Il Client ID
  OAuth in `config.js` è pubblico per natura ed è ammesso.
- **Vanilla**: HTML/CSS/JavaScript senza framework, senza build step, senza npm
  nell'app. Nessun backend: il browser parla direttamente con le API Google.
- Il foglio statistiche "Tre Quinti Wrapped - Foglio Calcolo" è la fonte di verità ed è
  compilato anche a mano: l'app aggiunge righe solo dopo anteprima e conferma.
- Il foglio delle risposte al modulo d'iscrizione si legge solo nelle colonne F:J.
- Il foglio "NON TOCCARE - DATABASE APP DI GESTIONE" è usato da tutti: ogni cambio di
  schema va dichiarato nella proposta.
- Notifiche solo dentro l'app (nessun server push).
- Interfaccia e testi interamente in italiano, pensati per utenti non tecnici
  (PC, Android, Chromebook, iPhone). Colore del marchio bordeaux `#730B2D`, tema
  chiaro/scuro/automatico.

## 4. Rilascio (ogni modifica a `docs/` che va online)

Ogni push su `main` che tocca `docs/` va **online per tutto il direttivo** in pochi
minuti (GitHub Pages). Per ogni rilascio:

1. Aumenta `version` in `docs/js/config.js`.
2. Aggiorna tutti i `?v=` in `docs/index.html` e in `docs/manifest.webmanifest`.
3. Cambia il nome della cache in `docs/sw.js`.
4. Aggiungi le note della versione in `docs/version.json` (pilota l'avviso di
   aggiornamento nell'app).
5. Prova con `?demo=1` (server locale `docs`) **prima** del push.
6. Se la modifica è rilevante, aggiorna anche `README.md` (badge versione e sezioni).

## 5. Commit

- Messaggi in italiano. Titolo breve che descrive il risultato, con la versione tra
  parentesi se è un rilascio, es. `Escursioni: caricamento progressivo (v2.5.1)`.
- Corpo a elenco puntato (`- ...`) con le modifiche principali, incluse spec e note
  aggiornate.
- Committa o pusha solo quando l'utente lo chiede.

## 6. Lavorare in due

- Prima di iniziare: `git pull` per partire dall'ultima versione.
- Controlla `openspec/changes/` (escluso `archive/`): sono le modifiche in corso. Non
  mettere mano a una modifica aperta dall'altro collaboratore senza accordarsi; per un
  lavoro nuovo crea una modifica nuova.
- Il numero di versione è condiviso: prima di un rilascio fai `git pull` e usa il numero
  successivo a quello già presente su `main`, così due rilasci non usano la stessa
  versione o lo stesso nome di cache.
- In caso di conflitti su `config.js`, `index.html`, `sw.js` o `version.json`, tieni la
  versione più alta e unisci le note di entrambi.
