# 🔑 Collegare l'app a Google (da fare una volta sola)

Per far accedere l'app ai Fogli con l'account **trequintitrekking@gmail.com** serve un *OAuth Client ID*: è il "permesso" che Google dà all'app per mostrare la finestra **Accedi con Google**. È gratuito e richiede circa 10 minuti.

> Fai tutti i passaggi **con l'account trequintitrekking@gmail.com** (in alto a destra nella Console deve comparire quello).

---

## 1. Crea il progetto

1. Vai su **https://console.cloud.google.com/**
2. In alto clicca sul selettore dei progetti → **Nuovo progetto**
3. Nome: `APP Direttivo 3-5` → **Crea**, poi selezionalo

## 2. Attiva le API

1. Menu ☰ → **API e servizi** → **Libreria**
2. Cerca **Google Sheets API** → **Abilita**
3. Torna alla Libreria, cerca **Google Drive API** → **Abilita**

## 3. Configura la schermata di consenso

1. Menu ☰ → **API e servizi** → **Schermata consenso OAuth** (o **Google Auth Platform**) → **Inizia**
2. **Informazioni app**: nome `APP Direttivo 3/5`, email di assistenza `trequintitrekking@gmail.com`
3. **Pubblico / Audience**: scegli **Esterno**
4. **Dati di contatto**: `trequintitrekking@gmail.com` → accetta le condizioni → **Crea**
5. Vai in **Accesso ai dati / Data access** → **Aggiungi o rimuovi ambiti** e aggiungi:
   - `.../auth/spreadsheets`
   - `.../auth/drive.metadata.readonly`
   - `openid` e `.../auth/userinfo.email`
   
   → **Aggiorna** → **Salva**
6. Vai in **Pubblico / Audience** → **Utenti di test** → **Add users** → `trequintitrekking@gmail.com` → **Salva**

Lascia l'app in stato **Test**: va benissimo, perché la usa un solo account.

## 4. Crea il Client ID

1. Menu ☰ → **API e servizi** → **Credenziali** (o **Client**) → **Crea credenziali** → **ID client OAuth**
2. Tipo di applicazione: **Applicazione web**
3. Nome: `APP Direttivo web`
4. **Origini JavaScript autorizzate** → aggiungi entrambe:
   - `https://mbbflash.github.io`
   - `http://localhost:8000`
5. **URI di reindirizzamento**: lascia vuoto → **Crea**
6. Copia l'**ID client**: è del tipo `123456789-abc...apps.googleusercontent.com`

## 5. Inseriscilo nell'app

Apri `docs/js/config.js` e sostituisci:

```js
googleClientId: "INSERISCI_CLIENT_ID.apps.googleusercontent.com",
```

con il tuo ID client, poi fai commit e push. In pochi minuti l'app online si aggiorna da sola.

> Il Client ID **non è un segreto**: da solo non dà accesso a nessun dato. Si può tenere nel repository pubblico.

---

## Al primo accesso

Google mostrerà l'avviso **"Google non ha verificato questa app"**: è normale per le app in stato Test.
Clicca **Avanzate** → **Vai a APP Direttivo 3/5 (non sicura)** → spunta **tutte** le caselle dei permessi → **Continua**.

L'app crea da sola, nel foglio *NON TOCCARE - DATABASE APP DI GESTIONE*, le schede `Tessere`, `Note`, `Conferme_Escursioni` e `Log`.

---

## 🔒 Dopo che tutto funziona: chiudi i link pubblici

Oggi **Libro Soci**, **database** e **fogli delle escursioni** sono condivisi come *"Chiunque abbia il link"*: chi ha il link può leggere anche codici fiscali e telefoni. Con il login non serve più.

Per ciascun foglio: **Condividi** → *Accesso generale* → **Con limitazioni** → **Fine**.

Poi disattiva la vecchia Web App di Apps Script (**Esegui il deployment** → **Gestisci deployment** → **Archivia**), che oggi restituisce i dati dei soci a chiunque ne conosca l'indirizzo.

> ⚠️ Fallo solo quando il direttivo usa già la nuova app: la vecchia versione con `server.py` smetterà di funzionare.
