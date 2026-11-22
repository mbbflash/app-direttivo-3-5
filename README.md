<div align="center">

# 🥾 APP Direttivo 3/5

**Gestione soci, tessere ed escursioni per il direttivo dell'associazione**

Una web app installabile su PC, Android e Chromebook, collegata direttamente ai Fogli Google dell'associazione.

[![Apri l'app](https://img.shields.io/badge/Apri%20l'app-mbbflash.github.io-1f6feb?logo=googlechrome&logoColor=white)](https://mbbflash.github.io/app-direttivo-3-5/)
![Versione](https://img.shields.io/badge/versione-2.0.3-blue)
![Login](https://img.shields.io/badge/accesso-Google-4285F4?logo=google&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-installabile-5A0FC8)
![Piattaforme](https://img.shields.io/badge/Windows%20%7C%20Android%20%7C%20ChromeOS%20%7C%20macOS%20%7C%20iOS-supportati-lightgrey)

**👉 https://mbbflash.github.io/app-direttivo-3-5/**

</div>

---

## 📑 Indice

- [Cos'è](#-cosè)
- [Funzionalità](#-funzionalità)
- [Come si usa](#-come-si-usa)
- [Installarla come app](#-installarla-come-app)
- [Dove finiscono i dati](#%EF%B8%8F-dove-finiscono-i-dati)
- [Sicurezza](#-sicurezza)
- [Aggiornamenti](#-aggiornamenti)
- [Come funziona](#-come-funziona)
- [Prima configurazione](#%EF%B8%8F-prima-configurazione)
- [Struttura del progetto](#-struttura-del-progetto)
- [Risoluzione dei problemi](#-risoluzione-dei-problemi)
- [Vecchia versione con server.py](#-vecchia-versione-con-serverpy)

---

## 💡 Cos'è

**APP Direttivo 3/5** permette ai membri del direttivo di consultare in un'unica pagina il **Libro Soci e Volontari** e le **iscrizioni alle escursioni** raccolte con i Google Form, e di tenere traccia insieme di **tessere cartacee, note e conferme**.

- 🔐 **Accesso con Google**: si entra con l'account dell'associazione, niente link pubblici.
- 🤝 **Dati condivisi**: spunte e note finiscono in un foglio Google comune, visibili a tutto il direttivo.
- 📱 **Ovunque**: funziona da browser e si installa come app su PC, Android, Chromebook e iPhone.
- 🔄 **Sempre aggiornata**: ogni nuova versione arriva da sola, senza scaricare niente.
- 📦 **Niente da installare**: niente Python, niente server, niente file di configurazione.

---

## ✨ Funzionalità

### 👥 Libro Soci

| Funzione | Cosa fa |
|---|---|
| **Caricamento automatico** | Dopo l'accesso legge il Libro Soci direttamente dal Foglio Google; *Aggiorna dati* lo rilegge |
| **Cruscotto** | Contatori di record totali, tessere **attive**, **in scadenza** (≤ 30 giorni) e **scadute / da rinnovare** |
| **Ricerca libera** | Cerca per nome, cognome, n° tessera, email, telefono, codice fiscale o città |
| **Filtro per tipologia** | Filtra per tipo di tessera (l'elenco si crea in automatico dai dati) |
| **Filtro per stato** | Non scadute · Solo attive · In scadenza · Scadute · Tutti |
| **Filtro tessere cartacee** | *Da preparare* · *Preparata, da consegnare* · *Consegnata* |
| **Tabella ordinabile** | Clic sull'intestazione per ordinare per tessera, nome, data tesseramento, scadenza, giorni rimanenti, stato o tipo |
| **Colonne** | Tessera, socio, tessera cartacea, tesseramento, scadenza, giorni (GG), stato, solleciti, note, nota, tipo tessera |
| **Calcolo scadenze** | Calcola i giorni alla scadenza e assegna lo stato con badge colorati |
| **Reset filtri** | Riporta ricerca e filtri alla situazione iniziale |

### 🪪 Scheda socio

Cliccando su un nominativo si apre la scheda personale con:

- 📋 tutti i dati del socio presenti nel Libro Soci;
- 📞 pulsante **Chiama** (link `tel:`) e ✉️ **Invia email** (link `mailto:`);
- 🥾 **curriculum escursioni**: a quali uscite ha partecipato e quante sono;
- ✅ spunte **Preparata** / **Consegnata** per la tessera cartacea, **condivise con il direttivo**;
- 📝 una **nota** sul socio, **condivisa con il direttivo** e inclusa nell'export CSV.

### 🗺️ Escursioni (Form)

| Funzione | Cosa fa |
|---|---|
| **Elenco uscite automatico** | Trova da solo nel Drive tutti i fogli risposte *"Form Iscrizione …"*, anche quelli nuovi |
| **Adesioni** | Tabella dei partecipanti all'uscita scelta, con contatti, stato socio e n° di escursioni fatte |
| **Ricerca partecipanti** | Cerca per nome, email o telefono |
| **Statistiche uscita** | Adesioni nel foglio, quanti sono **già soci**, partecipanti unici |
| **Abbinamento al Libro Soci** | Riconosce i soci da email, telefono o nome e cognome (anche in ordine invertito) |
| **Note per partecipante** | Nota su ogni iscritto all'uscita, **condivisa con il direttivo** |
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

### 🤝 Lavoro di squadra

- 💾 spunte, note e conferme salvate nel **database condiviso** su Google Fogli;
- 🕓 per ogni modifica: **chi** l'ha fatta (il nome che scrivi nel campo *Il tuo nome*) e **quando**, più uno storico completo nella scheda `Log`;
- 🔁 tornando sull'app dopo qualche minuto vedi le modifiche fatte dagli altri;
- 📶 **offline o sessione scaduta**: le modifiche restano in coda sul dispositivo e vengono salvate appena possibile (indicatore *● modifiche da salvare*).

### 🔔 Notifiche

- Notifiche del browser quando arrivano **nuove iscrizioni** a un'uscita (da attivare con *Attiva notifiche browser*).

### 💾 Import / Export

- **Esporta CSV** dell'elenco soci, comprese le note;
- **Importa CSV locale** per consultare un file senza collegarsi ai Fogli Google.

---

## 🚀 Come si usa

1. Apri **https://mbbflash.github.io/app-direttivo-3-5/**
2. Premi **Accedi con Google** e scegli **trequintitrekking@gmail.com**
3. Scrivi il tuo nome nel campo **Il tuo nome**: comparirà nello storico delle modifiche
4. Fatto: soci e database si caricano da soli. Le escursioni si caricano aprendo la scheda **Escursioni**.

L'accesso dura circa un'ora; quando scade l'app chiede di accedere di nuovo con un clic.
**Esci** chiude la sessione e cancella dal dispositivo tutti i dati in cache.

> [!TIP]
> Vuoi solo dare un'occhiata? Apri **https://mbbflash.github.io/app-direttivo-3-5/?demo=1**: modalità demo con dati inventati, nessun accesso a Google.

---

## 📲 Installarla come app

| Dispositivo | Come |
|---|---|
| **Android** | Apri il link in Chrome → menu ⋮ → **Installa app** (o *Aggiungi a schermata Home*) |
| **Chromebook** | Apri il link in Chrome → icona **Installa** nella barra degli indirizzi |
| **Windows / macOS** | Chrome o Edge → icona **Installa** nella barra degli indirizzi: compare nel menu Start / Launchpad |
| **iPhone / iPad** | Safari → **Condividi** → **Aggiungi alla schermata Home** |

L'app installata si apre a schermo intero, con la sua icona, come un programma normale.

---

## 🗄️ Dove finiscono i dati

| Dato | Dove sta | Condiviso con il direttivo? |
|---|---|---|
| Soci | Foglio *2 - Libro Soci e Volontari* (solo lettura) | ✅ Sì, è la fonte comune |
| Iscrizioni escursioni | Fogli *Form Iscrizione …* (solo lettura) | ✅ Sì |
| Spunte tessere cartacee | Foglio *NON TOCCARE - DATABASE APP DI GESTIONE* → `Tessere` | ✅ Sì |
| Note sui soci | Database → `Note` | ✅ Sì |
| Note e conferme escursioni | Database → `Conferme_Escursioni` | ✅ Sì |
| Storico modifiche | Database → `Log` | ✅ Sì |
| Cache e modifiche in coda | Browser del dispositivo | ❌ No, cancellate con **Esci** |

> [!IMPORTANT]
> Non modificare a mano il foglio *NON TOCCARE - DATABASE APP DI GESTIONE*: lo gestisce l'app.

---

## 🔒 Sicurezza

- I dati si leggono **solo dopo il login** con l'account abilitato (`trequintitrekking@gmail.com`): un altro account viene rifiutato.
- L'app usa i permessi di quell'account: **chi non ha accesso ai fogli non vede niente**, anche conoscendo l'indirizzo dell'app.
- Il codice è pubblico ma **non contiene dati né indirizzi dei fogli**: l'app li cerca per nome nel Drive dell'account.
- Il token di accesso dura al massimo un'ora e resta solo sul dispositivo; **Esci** lo revoca.

> [!WARNING]
> Completa la sicurezza togliendo la condivisione *"Chiunque abbia il link"* dai fogli e disattivando la vecchia Web App: vedi la fine di [SETUP-GOOGLE.md](SETUP-GOOGLE.md).

---

## 🔄 Aggiornamenti

**Non serve fare niente.** Con internet l'app carica sempre l'ultima versione pubblicata; senza internet apre l'ultima copia salvata.

### Per chi sviluppa

Ogni push su `main` che modifica la cartella `docs/` viene pubblicato in automatico su GitHub Pages in un paio di minuti, e alla successiva apertura tutti hanno la nuova versione. Ricordati di aumentare `version` in `docs/js/config.js`.

---

## 🔧 Come funziona

```
 App (browser / app installata)
        │  1. Accedi con Google  →  token dell'account dell'associazione
        ├──►  Google Drive API   →  trova i fogli per nome
        ├──►  Google Sheets API  →  legge Libro Soci ed escursioni
        └──►  Google Sheets API  →  legge e scrive il database condiviso
```

Nessun server intermedio: il browser parla direttamente con Google.

Permessi richiesti all'account:

| Permesso | Perché |
|---|---|
| `spreadsheets` | Leggere Libro Soci ed escursioni, scrivere nel database |
| `drive.metadata.readonly` | Trovare i fogli per nome (solo nomi, non il contenuto di altri file) |
| `email` | Controllare che l'account sia quello abilitato |

---

## ⚙️ Prima configurazione

Va fatta **una volta sola**: creare il *Client ID* Google per il login. Istruzioni passo passo in **[SETUP-GOOGLE.md](SETUP-GOOGLE.md)**.

Le impostazioni dell'app sono in [`docs/js/config.js`](docs/js/config.js): Client ID, account abilitati e nomi dei fogli da cercare.

---

## 📁 Struttura del progetto

```
app-direttivo-3-5/
├── docs/                              # 🌐 App web (pubblicata su GitHub Pages)
│   ├── index.html                     # Interfaccia
│   ├── manifest.webmanifest           # Dati per installarla come app
│   ├── sw.js                          # Funzionamento offline e aggiornamenti
│   ├── icons/                         # Icone dell'app
│   └── js/
│       ├── config.js                  # Impostazioni (Client ID, nomi dei fogli)
│       ├── google.js                  # Accesso Google, Drive e Sheets
│       ├── clouddb.js                 # Database condiviso e coda delle modifiche
│       ├── app.js                     # Collegamento tra pagina, login e database
│       └── demo.js                    # Dati finti per la modalità ?demo=1
├── SETUP-GOOGLE.md                    # Guida per creare il Client ID
│
│   # Vecchia versione locale (in dismissione)
├── gestione-soci-associazione.html
├── server.py · updater.py · VERSION · avvia-soci.sh
└── config.example.json · escursioni_config.example.json
```

---

## 🩺 Risoluzione dei problemi

| Problema | Soluzione |
|---|---|
| *Manca il Client ID Google* | Segui [SETUP-GOOGLE.md](SETUP-GOOGLE.md) |
| *Google non ha verificato questa app* | Normale: **Avanzate** → **Vai a APP Direttivo 3/5** |
| *Il browser ha bloccato la finestra di accesso* | Consenti i popup per il sito e riprova |
| *Questo account non è abilitato* | Esci da Google e accedi con `trequintitrekking@gmail.com` |
| *Foglio … non trovato nel Drive* | Il foglio è stato rinominato o spostato: il nome deve corrispondere a quello in `config.js` |
| *⚠ accedi per salvare* | La sessione è scaduta: clicca l'avviso e accedi, le modifiche in coda vengono salvate |
| *⚠ Offline* | Le modifiche restano in coda e partono appena torna la connessione |
| Non vedo le modifiche di un altro | Premi **Aggiorna dati** |

---

## 🗃️ Vecchia versione con server.py

La versione precedente (pagina locale + `server.py` + vecchia Web App pubblica) resta nel repository finché il direttivo non è passato alla nuova app. Per usarla:

```bash
cp config.example.json config.json   # inserisci l'URL della vecchia Web App
python server.py                     # poi apri http://localhost:8000/gestione-soci-associazione.html
```

**Per portare nella nuova app le spunte e le note salvate con la vecchia versione:** con `server.py` avviato apri **http://localhost:8000/docs/** sullo stesso browser in cui le avevi messe e accedi: l'app propone di caricarle nel database condiviso.
