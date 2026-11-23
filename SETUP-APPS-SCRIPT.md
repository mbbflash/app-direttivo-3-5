# Script di automazione (Apps Script)

Alcune operazioni l'app nel browser non le può fare da sola, per esempio creare il form di una nuova escursione e collegargli il foglio delle risposte. Le fa uno **script Apps Script** collegato al foglio database, che gira con l'account dell'associazione:

```
app  --scrive una richiesta-->  foglio database, scheda "Richieste"
                                        |
                       script (ogni minuto) la esegue
                                        |
app  <--legge stato e risultato--  scheda "Richieste"
```

Il codice è nella cartella [`apps-script/`](apps-script/) di questo repository e non contiene ID, link privati o password: i file si trovano per nome.

## Installazione (una volta sola)

1. Accedi a Google con **trequintitrekking@gmail.com** e apri il foglio **NON TOCCARE - DATABASE APP DI GESTIONE**.
2. Menu **Estensioni → Apps Script**. Si apre l'editor dello script collegato al foglio.
3. Nella colonna a sinistra:
   - apri il file `Codice.gs` (se si chiama `Code.gs` va bene uguale), cancella tutto e incolla il contenuto di [`apps-script/Codice.gs`](apps-script/Codice.gs);
   - clicca l'ingranaggio **Impostazioni progetto** e spunta **"Mostra il file manifest appsscript.json nell'editor"**; torna all'editor, apri `appsscript.json`, cancella tutto e incolla il contenuto di [`apps-script/appsscript.json`](apps-script/appsscript.json).
4. Salva (icona del dischetto o Ctrl+S). Come nome del progetto va bene "Automazioni APP Direttivo".
5. In alto scegli la funzione **`installa`** e premi **Esegui**. Google chiede i permessi:
   - "Rivedi autorizzazioni" → scegli l'account dell'associazione;
   - se compare "Google non ha verificato questa app": **Avanzate → Vai a … (non sicuro)**. È normale per gli script personali: lo script è vostro e gira solo sul vostro account;
   - consenti l'accesso a Fogli, Moduli e Drive.
6. Nel registro deve comparire `Installato: attivatore "esegui" ogni minuto.`

## Verifica

- Nell'editor, a sinistra, **Attivatori** (icona della sveglia): deve esserci **un solo** attivatore `esegui`, "A tempo, ogni minuto". Se ce ne sono due, eliminane uno.
- **Esecuzioni** (icona con le righe): ogni minuto compare un'esecuzione di `esegui` che dura pochi istanti.
- Facoltativo: scegli la funzione **`provaNomi`** e premi **Esegui**. Nel registro vedi i nomi e i titoli che lo script darebbe a tre uscite di esempio, senza creare nulla.
- Nel foglio database c'è la scheda **Richieste**. Se manca, la crea lo script o l'app al primo utilizzo.

## Aggiornamento

Quando il codice in `apps-script/` cambia, ripeti i passi 2–4 incollando la versione nuova. Non serve rieseguire `installa`, a meno che le note della versione non lo dicano: l'attivatore resta quello di prima.

## Se qualcosa non va

| Sintomo | Cosa fare |
|---|---|
| Nell'app: "Lo script di automazione non ha risposto" | Controlla in **Attivatori** che `esegui` ci sia e in **Esecuzioni** che non dia errori. Se l'attivatore manca, riesegui `installa`. |
| Errore "Non trovo il form con il nome del template" | Nel Drive deve esserci un solo form chiamato esattamente `[TEMPLATE] Form Iscrizione aaaa.mm.gg - "Nome Escursione"`. Se lo rinomini, aggiorna `TEMPLATE_NAME` in cima a `Codice.gs`. |
| Errore "Esiste già un file chiamato …" | Il form o il foglio di quell'uscita esistono già: usa quelli o cestinali prima di riprovare. |
| Una richiesta resta "in corso" | Dopo 10 minuti lo script la segna come errore ("Esecuzione interrotta: riprova"): basta rifare la richiesta dall'app. |

Per disattivare tutto: in **Attivatori** elimina `esegui`. L'app smette di poter creare uscite, ma tutto il resto continua a funzionare.
