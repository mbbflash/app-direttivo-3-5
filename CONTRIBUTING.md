# 🤝 Guida per chi sviluppa APP Direttivo 3/5

Questa guida è per chi lavora al codice dell'app (oggi **Matteo** e **Mattia**).
Le regole operative che Claude Code segue in automatico sono in [`CLAUDE.md`](CLAUDE.md);
qui c'è la spiegazione completa, da leggere una volta con calma.

> 💡 Con Claude Code aperto nella cartella del progetto puoi scrivere **`/benvenuto`**:
> Claude controlla che sul tuo PC sia installato tutto e ti spiega il progetto passo passo.

---

## 1. Cosa ti serve

| Cosa | Perché | Come verificare |
|---|---|---|
| Account GitHub con accesso al repository | Per fare `push` | Devi essere tra i *collaborator* di `mbbflash/app-direttivo-3-5` (l'invito arriva per email da GitHub: va accettato) |
| [Git](https://git-scm.com/) | Scaricare e inviare il codice | `git --version` |
| [GitHub CLI](https://cli.github.com/) *(consigliata)* | Login a GitHub senza chiavi SSH, controllo dei rilasci | `gh --version`, poi `gh auth login` |
| [Node.js](https://nodejs.org/) LTS | Solo per la CLI di OpenSpec (l'app **non** usa npm) | `node --version` |
| OpenSpec CLI **2.1.1** | Proposte e specifiche | `npm install -g @fission-ai/openspec@2.1.1`, poi `openspec --version` |
| [Python 3](https://www.python.org/) | Server locale per provare l'app | `python --version` |
| [Claude Code](https://claude.com/claude-code) | Lavorare al progetto con Claude | App desktop o `claude` da terminale |

Per provare l'app **con i dati veri** serve anche poter accedere all'account Google
dell'associazione: chiedilo a Matteo (le credenziali non vanno mai scritte nel repository
né nelle chat con Claude).

## 2. Prima configurazione

```powershell
gh auth login
```

```powershell
gh repo clone mbbflash/app-direttivo-3-5
```

Poi apri la cartella `app-direttivo-3-5` con Claude Code. Imposta nome ed email per i
commit (una volta sola, sul tuo PC):

```powershell
git config --global user.name "il-tuo-utente-github"
```

```powershell
git config --global user.email "la-tua-email-github"
```

Non serve `openspec init` (le skill sono già in `.claude/skills/`): **non** rilanciarlo.

## 3. Com'è fatto il progetto (in breve)

- `docs/` è **l'app**: HTML/CSS/JavaScript senza framework né build step. È anche la
  cartella pubblicata online.
- `apps-script/` è lo script di automazione che gira dentro Google (vedi §7).
- `openspec/specs/` descrive cosa fa oggi l'app, area per area; `openspec/changes/` contiene
  le modifiche in corso. Il contesto completo è in [`openspec/config.yaml`](openspec/config.yaml).
- Nessun server: il browser parla direttamente con Google Drive e Google Sheets usando
  l'account dell'associazione. I fogli si cercano **per nome** (`docs/js/config.js`).

⚠️ **Il repository è pubblico.** Mai ID o link dei fogli Google, mai dati dei soci (nomi,
email, telefoni…), mai password, né nel codice né nei commit né negli esempi.

## 4. Come si lavora (OpenSpec + Claude Code)

1. `git pull` per partire dall'ultima versione.
2. Guarda `openspec/changes/` (escluso `archive/`): sono le modifiche aperte. Non toccare
   quelle dell'altro senza accordarvi; per un lavoro nuovo creane una nuova.
3. In Claude Code:
   - `/openspec-explore` per ragionare sull'idea (facoltativo);
   - `/openspec-propose` per creare la proposta (proposta, design, spec, attività);
   - `/openspec-apply-change` per implementarla;
   - `/openspec-update-change` se in corso d'opera cambia qualcosa;
   - `/openspec-archive-change` a lavoro finito.
4. Prova in locale (§5), poi rilascia (§6).

Piccole correzioni (un refuso, un bug evidente) possono andare senza proposta.

## 5. Provare l'app in locale

In Claude Code basta chiedere di avviare il server **`docs`** (è in `.claude/launch.json`),
oppure da terminale:

```powershell
python -m http.server 8000 --directory docs
```

Poi apri:

- **http://localhost:8000/?demo=1** → modalità demo con dati inventati, nessun accesso a
  Google. È la prova obbligatoria prima di ogni rilascio.
- **http://localhost:8000/** → app vera, con login all'account dell'associazione
  (`localhost:8000` è già autorizzato nel Client ID Google; un'altra porta non funziona).

Se dopo una modifica vedi ancora la versione vecchia è colpa del service worker: ricarica
con **Ctrl+Shift+R** oppure apri gli Strumenti per sviluppatori → *Application* →
*Service workers* → *Unregister*.

## 6. 🚀 Il deploy su GitHub Pages: come funziona

**Non c'è un pulsante "pubblica": pubblicare = fare `push` su `main`.**

```
 tuo PC ──git push──► GitHub, branch main ──► GitHub Pages pubblica la cartella docs/
                                                     │  (1-3 minuti)
                                                     ▼
                         https://mbbflash.github.io/app-direttivo-3-5/
                                                     │
               all'apertura successiva l'app trova la nuova versione in version.json
               e mostra a tutto il direttivo l'avviso "Novità della versione"
```

Dettagli:

- Impostazioni del repository → *Pages*: sorgente **branch `main`, cartella `/docs`**
  (modalità "Deploy from a branch"). Nessun file di workflow da mantenere: GitHub esegue da
  solo il job **"pages build and deployment"**.
- Ogni push su `main` fa ripartire la pubblicazione, ma cambia qualcosa online solo se tocca
  `docs/`. Le modifiche a README, spec o `apps-script/` non cambiano l'app.
- Lavorare su un **altro branch non pubblica niente**: è il modo sicuro per lavori lunghi.
  Va online solo quando il branch viene unito in `main`.
- Gli utenti hanno l'app installata con una cache offline: per far arrivare a tutti la
  versione nuova serve **cambiare i numeri di versione** (sotto). Se te ne dimentichi,
  qualcuno resta con file vecchi.

### Checklist di ogni rilascio

1. `git pull` e guarda la versione già presente su `main`: usa **il numero successivo**
   (la versione è condivisa tra noi due).
2. `docs/js/config.js` → aumenta `version`.
3. `docs/index.html` e `docs/manifest.webmanifest` → aggiorna **tutti** i `?v=`.
4. `docs/sw.js` → cambia il nome della cache.
5. `docs/version.json` → aggiungi in cima la nuova versione con data e note (testi
   semplici, per utenti non tecnici: sono quelli che vede il direttivo).
6. Prova con `?demo=1` sul server locale.
7. Se serve, aggiorna `README.md` (badge versione e sezioni).
8. Commit (in italiano, es. `Escursioni: caricamento progressivo (v2.5.1)`) e `git push`.

Claude conosce questa checklist: basta chiedergli *"prepara il rilascio"*.

### Controllare che sia andato online

- Su GitHub: scheda **Actions** → l'ultimo *pages build and deployment* deve essere verde.
- Da terminale:

  ```powershell
  gh run list --workflow "pages-build-deployment" --limit 3
  ```

- Apri https://mbbflash.github.io/app-direttivo-3-5/version.json: deve mostrare la nuova
  versione (a volte serve un minuto in più per la cache di GitHub).

### Se qualcosa si rompe online

Il modo più rapido è annullare il commit difettoso e ripubblicare:

```powershell
git revert HEAD
```

poi rifai i passi di versione (numero **più alto**, mai riusare quello vecchio) e `git push`.
Mai `git push --force` su `main`.

## 7. Lo script Apps Script (non si pubblica da solo)

La cartella `apps-script/` **non** va online con il push: lo script vive dentro il foglio
*NON TOCCARE - DATABASE APP DI GESTIONE*. Se modifichi `apps-script/Codice.gs`, dopo il push
bisogna copiarlo a mano nell'editor Apps Script dell'account dell'associazione, come
spiegato in [SETUP-APPS-SCRIPT.md](SETUP-APPS-SCRIPT.md). Dillo all'altro, così sa che lo
script online è cambiato.

## 8. Lavorare in due senza pestarsi i piedi

- Sempre `git pull` prima di iniziare e prima di un rilascio.
- Una modifica OpenSpec = una persona. Se volete lavorare sulla stessa area, parlatene prima.
- Per lavori lunghi o sperimentali usate un branch (`git switch -c nome-lavoro`) e unitelo
  a `main` solo quando è pronto: `main` è sempre quello che vede il direttivo.
- Conflitti su `config.js`, `index.html`, `sw.js` o `version.json`: tenete la versione più
  alta e unite le note di entrambi.
- Il foglio database è condiviso da tutto il direttivo: ogni cambio di schema va dichiarato
  nella proposta e concordato.
- Commit e push solo quando avete deciso di farli: Claude non li fa di sua iniziativa.
