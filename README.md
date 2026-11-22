<div align="center">

# 🥾 APP Direttivo 3/5

**Gestione soci, tessere ed escursioni per il direttivo dell'associazione**

Una web app locale, in sola lettura, collegata ai Fogli Google dell'associazione.

![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)
![Dipendenze](https://img.shields.io/badge/dipendenze-nessuna-brightgreen)
![Modalità](https://img.shields.io/badge/modalit%C3%A0-sola%20lettura-blue)
![Piattaforme](https://img.shields.io/badge/Windows%20%7C%20macOS%20%7C%20Linux-supportati-lightgrey)

</div>

---

## 📑 Indice

- [Cos'è](#-cosè)
- [Funzionalità](#-funzionalità)
- [Avvio rapido](#-avvio-rapido)
- [Configurazione](#%EF%B8%8F-configurazione)
- [Dove finiscono i dati](#-dove-finiscono-i-dati)
- [Aggiornamenti](#-aggiornamenti)
- [Come funziona](#-come-funziona)
- [Struttura del progetto](#-struttura-del-progetto)
- [Risoluzione dei problemi](#-risoluzione-dei-problemi)

---

## 💡 Cos'è

**APP Direttivo 3/5** permette ai membri del direttivo di consultare in un'unica pagina il **Libro Soci e Volontari** e le **iscrizioni alle escursioni** raccolte con i Google Form.

- 🔒 **Sola lettura**: non modifica mai i Fogli Google.
- 💻 **Tutto in locale**: gira sul tuo computer, raggiungibile solo da te (`127.0.0.1`).
- 📦 **Zero installazioni**: serve solo Python 3, senza librerie aggiuntive.

---

## ✨ Funzionalità

### 👥 Libro Soci

| Funzione | Cosa fa |
|---|---|
| **Caricamento dal Foglio** | Con *Carica da Foglio* legge l'elenco aggiornato di soci e volontari dalla Web App Google |
| **Cruscotto** | Contatori di record totali, tessere **attive**, **in scadenza** (≤ 30 giorni) e **scadute / da rinnovare** |
| **Ricerca libera** | Cerca per nome, cognome, n° tessera, email, telefono, codice fiscale o città |
| **Filtro per tipologia** | Filtra per tipo di tessera (l'elenco si crea in automatico dai dati) |
| **Filtro per stato** | Non scadute · Solo attive · In scadenza · Scadute · Tutti |
| **Filtro tessere cartacee** | *Da preparare* · *Preparata, da consegnare* · *Consegnata* |
| **Tabella ordinabile** | Clic sull'intestazione per ordinare per tessera, nome, data tesseramento, scadenza, giorni rimanenti, stato o tipo |
| **Colonne** | Tessera, socio, tessera cartacea, tesseramento, scadenza, giorni (GG), stato, solleciti, note, nota locale, tipo tessera |
| **Calcolo scadenze** | Calcola i giorni alla scadenza e assegna lo stato con badge colorati |
| **Reset filtri** | Riporta ricerca e filtri alla situazione iniziale |

### 🪪 Scheda socio

Cliccando su un nominativo si apre la scheda personale con:

- 📋 tutti i dati del socio presenti nel Libro Soci;
- 📞 pulsante **Chiama** (link `tel:`) e ✉️ **Invia email** (link `mailto:`);
- 🥾 **curriculum escursioni**: a quali uscite ha partecipato e quante sono;
- ✅ spunte **Preparata** / **Consegnata** per la tessera cartacea;
- 📝 una **nota locale** personale, salvata nel browser e inclusa nell'export CSV.

### 🗺️ Escursioni (Form)

| Funzione | Cosa fa |
|---|---|
| **Elenco uscite** | Carica tutte le escursioni dai fogli risposte dei Google Form e le mostra in un menu |
| **Adesioni** | Tabella dei partecipanti all'uscita scelta, con contatti, stato socio e n° di escursioni fatte |
| **Ricerca partecipanti** | Cerca per nome, email o telefono |
| **Statistiche uscita** | Adesioni nel foglio, quanti sono **già soci**, partecipanti unici |
| **Abbinamento al Libro Soci** | Riconosce i soci da email, telefono o nome e cognome (anche in ordine invertito) |
| **Conferma e note** | Spunta di conferma e nota locale per ogni partecipante |
| **Contatore partecipazioni** | Classifica di tutti gli escursionisti con il numero di uscite fatte e l'elenco delle uscite, su tutti i fogli |

### 🚨 Avvisi uscita

Per ogni escursione l'app segnala in automatico cosa controllare:

- ⚠️ iscritti **non trovati nel Libro Soci** o con **tessera non attiva/scaduta**;
- 📭 iscritti **senza email**;
- 🪪 soci iscritti con **tessera cartacea ancora da preparare o consegnare**.

### 📣 Comunicazioni ai partecipanti

- 📋 **Copia email in CCN** di tutti gli iscritti all'uscita (senza duplicati);
- ✉️ **Apri in posta (CCN)**: apre il programma di posta con destinatari, oggetto e testo già pronti;
- 📝 **Modelli di testo**: *annullamento escursione* o *informazioni utili*, da copiare con un clic.

### 🔔 Notifiche

- Notifiche del browser quando arrivano **nuove iscrizioni** a un'uscita (da attivare con *Attiva notifiche browser*).

### 🔄 Aggiornamenti automatici

- All'apertura l'app controlla se su GitHub c'è una **nuova versione** e la propone con le note delle novità;
- **Aggiorna ora** scarica e installa la nuova versione e riavvia l'app da sola;
- **Più tardi** o **Salta questa versione** per rimandare;
- clic sul numero di versione (es. `v1.1.0`) accanto al titolo per controllare in qualsiasi momento.

### 💾 Import / Export

- **Esporta CSV** dell'elenco soci, comprese le note locali;
- **Importa CSV locale** per consultare un file senza collegarsi ai Fogli Google.

---

## 🚀 Avvio rapido

> **Serve:** Python 3 e una connessione a internet.

```bash
# 1. Scarica il progetto
git clone https://github.com/mbbflash/app-direttivo-3-5.git
cd app-direttivo-3-5

# 2. Crea i file di configurazione (vedi sotto) e inserisci gli URL
cp config.example.json config.json
cp escursioni_config.example.json escursioni_config.json

# 3. Avvia
python server.py          # Windows
./avvia-soci.sh           # macOS / Linux
```

Poi apri nel browser 👉 **http://localhost:8000/gestione-soci-associazione.html**

Per fermare l'app premi `CTRL + C` nel terminale.

> [!WARNING]
> Non aprire il file HTML con un doppio clic (`file:///…`): senza il server i dati non si caricano.

---

## ⚙️ Configurazione

Gli indirizzi dei Fogli Google **non sono nel repository** per proteggere i dati dei soci. Vanno messi in due file locali, già esclusi da git:

| File | Contenuto | Obbligatorio |
|---|---|---|
| `config.json` | URL della Web App Google Apps Script (`web_app_url`) | ✅ Sì |
| `escursioni_config.json` | Elenco dei fogli escursioni, usato come riserva | ➖ Facoltativo |

**`config.json`**
```json
{
  "web_app_url": "https://script.google.com/macros/s/ID_DEPLOYMENT/exec"
}
```

In alternativa a `config.json` puoi impostare la variabile d'ambiente `SOCI_WEB_APP_URL`.

**`escursioni_config.json`**
```json
[
  {
    "id": "esc-1",
    "titolo": "Escursione 1",
    "data": "",
    "url": "https://docs.google.com/spreadsheets/d/ID_FOGLIO/edit?gid=0#gid=0"
  }
]
```

> [!IMPORTANT]
> Chiedi gli URL al presidente o a chi gestisce i Fogli e **non pubblicarli mai**: chiunque li abbia può leggere i dati dei soci.

---

## 🗄️ Dove finiscono i dati

| Dato | Dove sta | Condiviso con il direttivo? |
|---|---|---|
| Soci ed escursioni | Fogli Google, letti ogni volta dal server | ✅ Sì, è la fonte comune |
| Spunte tessere cartacee | `localStorage` del tuo browser | ❌ No, solo sul tuo PC |
| Note locali e conferme | `localStorage` del tuo browser | ❌ No, solo sul tuo PC |
| URL privati | `config.json`, `escursioni_config.json` | ❌ No, da passare a mano |

> [!NOTE]
> Ogni membro del direttivo vede solo le proprie spunte e note. Cambiando browser o computer si ripartono da zero: usa **Esporta CSV** per conservarle.

---

## 🔄 Aggiornamenti

### Per chi usa l'app

Quando esce una nuova versione, all'apertura compare un avviso in cima alla pagina:

1. leggi le novità e premi **Aggiorna ora**;
2. l'app scarica l'ultima release da GitHub, salva i file attuali in `backup/` e si riavvia;
3. la pagina si ricarica da sola con la nuova versione.

Non vengono mai toccati `config.json`, `escursioni_config.json`, le spunte e le note salvate nel browser.

> [!TIP]
> Se qualcosa non va, i file della versione precedente sono in `backup/v<versione>_<data>/`: basta copiarli di nuovo nella cartella dell'app.

> [!NOTE]
> Se la cartella è un clone git (contiene `.git`), l'app avvisa della nuova versione ma non la installa: aggiorna con `git pull`.

### Per chi sviluppa: pubblicare una nuova versione

L'app propone un aggiornamento **solo quando viene pubblicata una Release** su GitHub, non a ogni commit.

```bash
# 1. Aumenta il numero di versione
echo 1.2.0 > VERSION

# 2. Commit e push
git commit -am "Versione 1.2.0"
git push

# 3. Pubblica la release (il tag deve corrispondere a VERSION)
gh release create v1.2.0 --title "v1.2.0" --notes "- Novità 1
- Correzione 2"
```

Le note della release sono quelle che il direttivo vede nell'avviso di aggiornamento.

---

## 🔧 Come funziona

```
 Browser  ──►  server.py (localhost:8000)  ──►  Web App Google Apps Script  ──►  Fogli Google
                    │
                    └──►  esportazione CSV dei fogli escursioni (riserva)
```

- `GET /api/soci` → elenco soci dalla Web App
- `GET /api/escursioni` → iscrizioni alle escursioni dalla Web App; se non risponde, legge i fogli indicati in `escursioni_config.json`
- `GET /api/version` → versione installata
- `GET /api/update/check` → confronta la versione installata con l'ultima Release su GitHub
- `POST /api/update/install` → scarica e installa l'ultima Release, poi riavvia il server

---

## 📁 Struttura del progetto

```
app-direttivo-3-5/
├── gestione-soci-associazione.html   # Interfaccia web
├── server.py                         # Server locale e API
├── updater.py                        # Aggiornamenti automatici da GitHub
├── VERSION                           # Versione installata
├── avvia-soci.sh                     # Avvio rapido macOS / Linux
├── config.example.json               # Modello per config.json
├── escursioni_config.example.json    # Modello per escursioni_config.json
├── config.json                       # 🔒 locale, escluso da git
├── escursioni_config.json            # 🔒 locale, escluso da git
└── backup/                           # 🔒 copie create dagli aggiornamenti, escluso da git
```

---

## 🩺 Risoluzione dei problemi

| Problema | Soluzione |
|---|---|
| `URL della Web App mancante` all'avvio | Crea `config.json` partendo da `config.example.json` |
| La pagina non si apre | Controlla che il terminale con `server.py` sia ancora aperto |
| Errore porta 8000 già in uso | L'app è già avviata in un'altra finestra: chiudila o usa quella |
| *Errore caricamento Foglio* | Controlla la connessione e che l'URL in `config.json` sia giusto |
| Escursione *Impossibile leggere il foglio* | Il foglio dev'essere condiviso con chiunque abbia il link |
| *Controllo aggiornamenti non riuscito* | Serve internet; l'app funziona comunque, riprova più tardi |
| Dopo un aggiornamento l'app non riparte | Chiudi il terminale e avvia di nuovo `server.py`; i vecchi file sono in `backup/` |
| `python` non trovato su Windows | Installa Python da [python.org](https://www.python.org/downloads/) spuntando *Add to PATH* |
