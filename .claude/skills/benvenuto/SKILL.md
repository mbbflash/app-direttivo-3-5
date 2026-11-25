---
name: benvenuto
description: Accoglie un nuovo collaboratore del progetto APP Direttivo 3/5 (per esempio Mattia) - controlla che sul PC ci sia tutto il necessario, spiega com'è fatto il progetto, come si lavora con OpenSpec e come funziona il deploy su GitHub Pages. Usala quando l'utente scrive /benvenuto, dice di essere nuovo, chiede "come funziona il progetto", "come si pubblica", "come funziona il deploy" o "cosa devo installare".
allowed-tools: Bash(git --version) Bash(gh --version) Bash(gh auth status) Bash(node --version) Bash(python --version) Bash(openspec --version) Bash(git config user.name) Bash(git status) Bash(git pull)
---

Accogli il collaboratore **in italiano**, con tono semplice e amichevole. Il riferimento
completo è [`CONTRIBUTING.md`](../../../CONTRIBUTING.md): leggilo prima di iniziare e non
contraddirlo. Le regole vincolanti sono in `CLAUDE.md`.

## 1. Controlla gli strumenti

Esegui (ognuno può fallire: non è un errore tuo, annota cosa manca):

- `git --version`, `git config user.name`
- `gh --version` e `gh auth status`
- `node --version`
- `openspec --version` (deve essere **2.1.1**)
- `python --version`
- `git status` e, se il working tree è pulito, `git pull`

Mostra una tabellina ✅/❌ e, per ciò che manca, il comando o il link per installarlo
(da `CONTRIBUTING.md` §1–2), ciascun comando in un blocco `powershell` separato.
Non installare niente da solo: proponi e lascia che sia l'utente a farlo o a chiedertelo.

## 2. Spiega il progetto, a piccoli passi

Presenta un argomento alla volta, in poche righe, e chiedi se è tutto chiaro prima di
passare al successivo:

1. **Cos'è l'app** e dove sta il codice (`docs/` = app, `apps-script/`, `openspec/`).
2. **Le regole d'oro**: repository pubblico (mai ID dei fogli, link privati, dati dei soci,
   password); niente framework/npm/build nell'app; il database condiviso non si cambia
   senza dichiararlo.
3. **Come si lavora**: `git pull` → controllare `openspec/changes/` → propose → apply →
   archive. Elenca le modifiche aperte ora (cartelle in `openspec/changes/` escluso
   `archive/`) con una riga ciascuna presa dal loro `proposal.md`, e ricorda di non toccare
   quelle dell'altro senza accordarsi.
4. **Provare in locale**: server `docs` di `.claude/launch.json` (porta 8000), `?demo=1`
   per i dati finti; il login vero funziona solo su `localhost:8000`.
5. **Il deploy su GitHub Pages** (il punto più importante, spiegalo bene):
   - pubblicare = `push` su `main`; GitHub Pages pubblica la cartella `docs/` del branch
     `main` in 1–3 minuti, per tutto il direttivo; nessun pulsante, nessun workflow da
     mantenere ("pages build and deployment" parte da solo);
   - un branch diverso da `main` non va online;
   - la checklist di versione (config.js, `?v=`, cache di sw.js, version.json) serve perché
     gli utenti hanno l'app in cache: senza, restano con la versione vecchia;
   - la versione è condivisa: `git pull` e numero successivo a quello su `main`;
   - come controllare: scheda Actions o `gh run list --workflow "pages-build-deployment" --limit 3`,
     e `https://mbbflash.github.io/app-direttivo-3-5/version.json`;
   - se si rompe: `git revert`, nuova versione più alta, push; mai `push --force`;
   - `apps-script/` non si pubblica col push: va copiato a mano (SETUP-APPS-SCRIPT.md).
6. **Lavorare in due**: branch per lavori lunghi, conflitti sui file di versione (tenere la
   più alta e unire le note), commit in italiano, commit/push solo quando lo decide lui.

## 3. Chiudi

Riassumi in 3–4 punti cosa resta da fare sul suo PC (strumenti mancanti, accesso
all'account Google dell'associazione da chiedere a Matteo) e suggerisci un primo passo
concreto: avviare il server `docs` e aprire `?demo=1`.
