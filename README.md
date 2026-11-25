<div align="center">

# 🥾 APP Direttivo 3/5

**Gestione soci, tessere ed escursioni per il direttivo dell'associazione**

Una web app installabile su PC, Android e Chromebook, collegata direttamente ai Fogli Google dell'associazione.

[![Apri l'app](https://img.shields.io/badge/Apri%20l'app-mbbflash.github.io-1f6feb?logo=googlechrome&logoColor=white)](https://mbbflash.github.io/app-direttivo-3-5/)
![Versione](https://img.shields.io/badge/versione-2.5.4-blue)
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
| **Da sollecitare** | Soci in scadenza o scaduti non sollecitati negli ultimi 14 giorni |
| **Sollecito di gruppo** | Con il filtro *In scadenza*, *Scadute* o *Da sollecitare*: un'email in CCN a tutti, poi l'app li segna come sollecitati |
| **Tabella ordinabile** | Clic sull'intestazione per ordinare per tessera, nome, data tesseramento, scadenza, giorni rimanenti, stato o tipo |
| **Colonne** | Tessera, socio, tessera cartacea, tesseramento, scadenza, giorni (GG), stato, solleciti, note, nota, tipo tessera |
| **Calcolo scadenze** | Calcola i giorni alla scadenza e assegna lo stato con badge colorati |
| **Reset filtri** | Riporta ricerca e filtri alla situazione iniziale |
| **Contatori cliccabili** | Clic su *Attive*, *In scadenza* o *Scadute* per filtrare subito l'elenco |
| **Su telefono** | Ogni socio diventa una scheda leggibile, senza scorrere di lato |

### 🪪 Scheda socio

Cliccando su un nominativo si apre la scheda personale con:

- 📋 tutti i dati del socio presenti nel Libro Soci;
- 📞 pulsanti **Chiama**, 💬 **WhatsApp**, ✈️ **Telegram** e ✉️ **Email**;
- 🥾 **curriculum escursioni**: a quali uscite ha partecipato e quante sono;
- ✅ spunte **Preparata** / **Consegnata** per la tessera cartacea, **condivise con il direttivo**;
- 📝 una **nota** sul socio, **condivisa con il direttivo** e inclusa nell'export CSV.

### 🔔 Sollecita rinnovo

Nella scheda di un socio in scadenza o scaduto compare **Sollecita rinnovo**:

- messaggio già scritto con nome, n° tessera e data di scadenza, **modificabile** prima dell'invio;
- invio con **WhatsApp** (testo già pronto), **Telegram** (il testo viene copiato, basta incollarlo) o **Email**;
- **Segna come sollecitato** per i solleciti fatti a voce o al telefono;
- ogni sollecito (data, canale, chi) finisce nel database → scheda `Solleciti`, così tutto il direttivo vede chi è già stato contattato e nessuno viene sollecitato due volte.

### 🗺️ Escursioni (Form)

| Funzione | Cosa fa |
|---|---|
| **Caricamento veloce** | L'elenco delle uscite compare subito e l'uscita aperta si legge per prima; le altre arrivano in sottofondo con il conteggio di avanzamento. Le uscite non modificate restano salvate sul dispositivo e non vengono rilette |
| **Elenco uscite automatico** | Trova da solo nel Drive tutti i fogli risposte *"Iscrizioni AAAA.MM.GG - Nome (Risposte)"* (riconosce ancora anche la vecchia sintassi *"Form Iscrizione AAAA.MM.GG - "Nome" (Risposte)"*), anche quelli nuovi, in ordine di data |
| **Uscite rimandate o annullate** | Basta scrivere `[RIMANDATA]` o `[ANNULLATA]` nel nome del foglio iscrizioni: l'uscita resta nell'elenco con lo stato accanto al nome, ma non conta nelle statistiche, nel contatore partecipazioni e nel curriculum dei soci |
| **Adesioni** | Tabella dei partecipanti all'uscita scelta, con contatti (e collegamenti rapidi WhatsApp/Telegram), stato socio e n° di escursioni fatte |
| **Ricerca partecipanti** | Cerca per nome, email o telefono |
| **Statistiche uscita** | Adesioni nel foglio, quanti sono **già soci**, partecipanti unici |
| **Abbinamento al Libro Soci** | Riconosce i soci da email, telefono o nome e cognome (anche in ordine invertito, con secondo nome o doppio cognome); in classifica collega i nomi ai soci tramite l'email usata nei moduli |
| **Note e conferme per partecipante** | Nota e spunta *Confermato* su ogni iscritto, **condivise con il direttivo** |
| **Esporta partecipanti** | CSV degli iscritti all'uscita con contatti, stato socio, conferme e note |
| **Uscite per iscritto** | Colonna *N° escursioni* con le uscite fatte da ogni iscritto, contate su tutti i fogli (escluse le uscite rimandate o annullate) |
| **Nuova escursione programmata** | Pulsante che crea il form di iscrizione (copia del template, con titolo e giorno della settimana) e il foglio *Iscrizioni AAAA.MM.GG - Nome (Risposte)* collegato, poi dà il link da condividere. Lo fa lo script di automazione: vedi [SETUP-APPS-SCRIPT.md](SETUP-APPS-SCRIPT.md) |

### 📊 Statistiche

Legge il foglio **"Tre Quinti Wrapped - Foglio Calcolo"** (presenze effettive, una scheda `DatiEscursioniAAAA` per anno), che resta il vostro foglio e si può continuare a modificare a mano.

- scelta dell'**anno** o di tutti gli anni, ricerca per escursionista o uscita;
- totali: uscite, presenze, escursionisti, media per uscita, km, dislivello e ore;
- grafico delle **presenze per uscita**, **classifica** degli escursionisti (ordinabile) ed elenco delle uscite;
- **uscite dei form non ancora nel foglio**: l'app le segnala e, con *Aggiungi al foglio*, propone le righe da scrivere (presenti segnati *Confermato*, più eventuali presenti senza iscrizione, ore, km e dislivello). Scrive solo dopo conferma, nello stesso formato di sempre (`Socio | =UPPER(A) | Data | NomeEscursione | Ore | Km | Dislivello`), riusando la grafia dei nomi già presente nel foglio. Le uscite rimandate o annullate non vengono proposte, e le righe del foglio con quelle parole nel nome vengono scartate;
- nella **scheda socio** il curriculum mostra le presenze vere con ore, km e dislivello totali.

### 🧭 Prossima uscita (assistente)

Aiuta il direttivo a scegliere la prossima escursione. Legge il foglio **"Tre Quinti Trekking - Schede Tecniche Escursioni …"** (cercato per inizio del nome, solo lettura) e lo incrocia con presenze e form:

- filtri: **data prevista**, difficoltà, dislivello e durata massimi, **punto di ritrovo**, *escludi i percorsi fatti negli ultimi 12 mesi*;
- classifica con un **punteggio da 0 a 100** e le **motivazioni**: quota adatta alla stagione (neve d'inverno, caldo d'estate), tempo dall'ultima volta, partecipazione media rispetto alle altre uscite, varietà di difficoltà rispetto alle ultime uscite;
- i percorsi con un form già aperto per una data futura risultano **già in programma**;
- un percorso la cui ultima uscita è stata **rimandata o annullata** (negli ultimi 18 mesi) e non ancora rifatta riceve **+20** con la motivazione *da recuperare*; stagione e quota continuano a pesare;
- per ogni proposta: dati tecnici, ritrovo, descrizione, uscite passate e **Copia annuncio** (testo pronto per Telegram, WhatsApp o email);
- tabella **Tutti i percorsi** con l'esito di ognuno.

Il punteggio è calcolato con regole fisse dentro l'app: nessun servizio esterno di intelligenza artificiale. I nomi brevi dei punti di ritrovo si possono cambiare in `config.js` (`ritrovoAlias`).

### 🚨 Avvisi uscita

Per ogni escursione l'app segnala in automatico cosa controllare:

- ⚠️ iscritti **non trovati nel Libro Soci** o con **tessera non attiva/scaduta**;
- 📭 iscritti **senza email**;
- 🪪 soci iscritti con **tessera cartacea ancora da preparare o consegnare**.

### 📣 Comunicazioni ai partecipanti

- 📋 **Copia email in CCN** di tutti gli iscritti all'uscita (senza duplicati);
- ✉️ **Apri in posta (CCN)**: apre il programma di posta con destinatari, oggetto e testo già pronti;
- ✈️ **Telegram**: invia lo stesso testo in un gruppo, canale o chat Telegram;
- 📝 **Modelli di testo**: *annullamento escursione* o *informazioni utili*, da copiare con un clic.

### 🤝 Lavoro di squadra

- 💾 spunte, note e conferme salvate nel **database condiviso** su Google Fogli;
- 🕓 per ogni modifica: **chi** l'ha fatta (il nome che scrivi nel campo *Il tuo nome*) e **quando**, più uno storico completo nella scheda `Log`;
- 🔁 tornando sull'app dopo qualche minuto vedi le modifiche fatte dagli altri;
- 📶 **offline o sessione scaduta**: le modifiche restano in coda sul dispositivo e vengono salvate appena possibile (indicatore *● modifiche da salvare*).

### 🎨 Interfaccia

- Logo e colori **Tre Quinti Trekking** (bordeaux), anche come icona dell'app;
- Tema **chiaro / scuro / automatico** (pulsante in alto a destra);
- scorciatoie da tastiera: **/** per cercare, **Esc** per chiudere la scheda socio.

### 🔔 Notifiche

Si attivano con la **campanella** in alto. Con l'app aperta (anche in background) ogni 3 minuti controlla i fogli e avvisa di:

- ogni **nuova iscrizione a un'escursione** (nome e totale iscritti);
- ogni **nuova richiesta di iscrizione all'associazione** dal foglio *3 - Modulo Iscrizione Tre Quinti Trekking APS (Risposte)* (legge solo data, email, tipo di tessera, nome e cognome);
- ogni **nuova versione dell'app**, con l'elenco delle novità (e dopo l'aggiornamento un riquadro *Novità della versione*).

L'app ricorda quante righe aveva ogni foglio: alla riapertura avvisa anche delle iscrizioni arrivate mentre era chiusa. Con l'app completamente chiusa le notifiche non possono arrivare (servirebbe un server dedicato).

### 💾 Export

- **Esporta CSV** dell'elenco soci, comprese spunte e note;
- **Esporta partecipanti** di un'escursione.

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
| Iscrizioni escursioni | Fogli *Iscrizioni AAAA.MM.GG - …* o *Form Iscrizione AAAA.MM.GG - …* (solo lettura) | ✅ Sì |
| Spunte tessere cartacee | Foglio *NON TOCCARE - DATABASE APP DI GESTIONE* → `Tessere` | ✅ Sì |
| Note sui soci | Database → `Note` | ✅ Sì |
| Note e conferme escursioni | Database → `Conferme_Escursioni` | ✅ Sì |
| Solleciti di rinnovo | Database → `Solleciti` | ✅ Sì |
| Presenze e statistiche | Foglio *Tre Quinti Wrapped - Foglio Calcolo* | ✅ Sì |
| Schede tecniche dei percorsi | Foglio *Tre Quinti Trekking - Schede Tecniche Escursioni …* (solo lettura) | ✅ Sì |
| Richieste allo script (nuove uscite) | Database → `Richieste` | ✅ Sì |
| Form e fogli delle nuove uscite | Creati dallo script nella cartella del form template | ✅ Sì |
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

Ogni push su `main` che modifica la cartella `docs/` viene pubblicato in automatico su GitHub Pages in un paio di minuti, e alla successiva apertura tutti hanno la nuova versione. Ricordati di aumentare `version` in `docs/js/config.js`, il `?v=` di script e icone in `docs/index.html` e `docs/manifest.webmanifest` (così nessuno resta con file vecchi in cache) e di aggiungere le novità in `docs/version.json`: è da lì che l'app avvisa tutti dell'aggiornamento.

---

## 🔧 Come funziona

```
 App (browser / app installata)
        │  1. Accedi con Google  →  token dell'account dell'associazione
        ├──►  Google Drive API   →  trova i fogli per nome
        ├──►  Google Sheets API  →  legge Libro Soci ed escursioni
        └──►  Google Sheets API  →  legge e scrive il database condiviso
                                        │
              Script Apps Script  ◄─────┘  scheda `Richieste` (es. nuova escursione)
              (ogni minuto)  →  crea form e foglio risposte con l'account dell'associazione
```

Nessun server intermedio: il browser parla direttamente con Google. Le poche operazioni che il browser non può fare da solo (come creare il form di una nuova uscita) le esegue uno script Apps Script collegato al foglio database.

Permessi richiesti all'account:

| Permesso | Perché |
|---|---|
| `spreadsheets` | Leggere Libro Soci ed escursioni, scrivere nel database |
| `drive.metadata.readonly` | Trovare i fogli per nome (solo nomi, non il contenuto di altri file) |
| `email` | Controllare che l'account sia quello abilitato |

---

## ⚙️ Prima configurazione

Va fatta **una volta sola**:

1. creare il *Client ID* Google per il login: istruzioni passo passo in **[SETUP-GOOGLE.md](SETUP-GOOGLE.md)**;
2. *(facoltativo, serve per **Nuova escursione programmata**)* installare lo script di automazione sul foglio database: guida in **[SETUP-APPS-SCRIPT.md](SETUP-APPS-SCRIPT.md)**.

Le impostazioni dell'app sono in [`docs/js/config.js`](docs/js/config.js): Client ID, account abilitati e nomi dei fogli da cercare.

---

## 📁 Struttura del progetto

```
app-direttivo-3-5/
├── docs/                              # 🌐 App web (pubblicata su GitHub Pages)
│   ├── index.html                     # Interfaccia
│   ├── manifest.webmanifest           # Dati per installarla come app
│   ├── sw.js                          # Funzionamento offline e aggiornamenti
│   ├── version.json                   # Versione e novità mostrate agli utenti
│   ├── icons/                         # Icone dell'app
│   └── js/
│       ├── config.js                  # Impostazioni (Client ID, nomi dei fogli)
│       ├── google.js                  # Accesso Google, Drive e Sheets
│       ├── clouddb.js                 # Database condiviso e coda delle modifiche
│       ├── storage.js                 # Memoria del dispositivo (separata in demo)
│       ├── app.js                     # Collegamento tra pagina, login e database
│       └── demo.js                    # Dati finti per la modalità ?demo=1
├── apps-script/                       # ⚙️ Script di automazione (Apps Script)
│   ├── Codice.gs                      # Esegue le richieste dell'app (es. nuova escursione)
│   └── appsscript.json                # Impostazioni e permessi dello script
├── openspec/                          # 📐 Specifiche dell'app (OpenSpec)
│   ├── specs/                         # Comportamento attuale, per area
│   └── changes/                       # Modifiche proposte o in corso
├── SETUP-GOOGLE.md                    # Guida per creare il Client ID
└── SETUP-APPS-SCRIPT.md               # Guida per installare lo script di automazione
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
| *Nuova escursione programmata* non parte | Lo script di automazione non è installato o non è attivo: vedi [SETUP-APPS-SCRIPT.md](SETUP-APPS-SCRIPT.md) |
