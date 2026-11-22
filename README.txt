GESTIONE SOCI E ESCURSIONI - MANUALE D'USO IN LOCALE (DIRETTIVO)
==================================================================

Questa guida spiega come avviare e usare in locale l'applicazione per la
consultazione del Libro Soci e delle iscrizioni alle Escursioni tramite il
server locale in Python.

------------------------------------------------------------------
1. COSA SERVE PRIMA DI INIZIARE
------------------------------------------------------------------
- Un computer (Linux, macOS o Windows) con Python 3 installato.
- Una connessione a internet attiva per recuperare i dati aggiornati tramite
  il server locale.

Verifica rapida di Python nel terminale:
- Linux / macOS:  python3 --version
- Windows:        python --version

------------------------------------------------------------------
2. INSTALLAZIONE E AVVIO PASSO PASSO
------------------------------------------------------------------
Passo A - Estrai i file
Estrai l'archivio in una cartella dedicata sul tuo computer (ad esempio:
"gestione-soci-direttivo"). Evita di lasciarlo dentro cartelle temporanee o
di lavorarci direttamente dentro un archivio compresso.

Passo B - Apri il terminale nella cartella
Apri il terminale (su Linux/macOS) o il Prompt dei comandi / PowerShell
(su Windows) e spostati dentro la cartella estratta, ad esempio:
  cd ~/gestione-soci-direttivo
(oppure il percorso della cartella dove hai estratto i file).

Passo C - Configura gli URL privati (solo la prima volta)
Gli indirizzi della Web App Google e dei fogli escursioni NON sono nel
repository git: vanno messi in due file locali, esclusi da git (.gitignore).
1. Copia "config.example.json" in "config.json" e scrivi in "web_app_url"
   l'URL della Web App Apps Script (https://script.google.com/macros/s/.../exec).
   In alternativa puoi impostare la variabile d'ambiente SOCI_WEB_APP_URL.
2. Copia "escursioni_config.example.json" in "escursioni_config.json" e
   inserisci gli URL dei fogli Google delle escursioni (usato solo come
   riserva se la Web App non restituisce le escursioni).
Chiedi questi URL al presidente / a chi gestisce i fogli: non pubblicarli.
Senza "config.json" il server non parte e spiega cosa manca.

Passo D - Avvia il server locale
- Su Linux / macOS:
    ./avvia-soci.sh
  (oppure: python3 server.py)
- Su Windows:
    python server.py

Se tutto va bene, il server restera' in ascolto sulla porta 8000.
Lascia aperta questa finestra del terminale per tutto il tempo in cui usi
l'applicazione.

Passo E - Apri l'applicazione nel browser
Apri il browser (Chrome, Edge, Firefox, ecc.) e vai esattamente a questo
indirizzo:
  http://localhost:8000/gestione-soci-associazione.html

ATTENZIONE:
Non aprire il file "gestione-soci-associazione.html" facendo doppio clic su di
esso nella cartella dei file (indirizzo "file:///..."). In quel modo il browser
non comunica con "server.py" e il caricamento dei dati va in errore.

------------------------------------------------------------------
3. COME CHIUDERE L'APPLICAZIONE
------------------------------------------------------------------
1. Chiudi pure la scheda del browser.
2. Torna sulla finestra del terminale dove sta girando il server e premi:
     CTRL + C

------------------------------------------------------------------
4. COMPORTAMENTO DEI DATI E DELLE SPUNTE TESSERE
------------------------------------------------------------------
- Dati soci ed escursioni: vengono letti tramite il server locale/proxy.
- Spunte "Preparata" / "Consegnata" e note locali: vengono salvate nel
  "localStorage" del browser che stai usando su quel computer. Questo
  significa che ogni membro del direttivo vede le proprie spunte e note salvate
  nel proprio browser locale.
- Configurazione escursioni ("escursioni_config.json"): contiene l'elenco delle
  schede/fogli delle escursioni. Se vengono aggiunte nuove uscite o aggiornati
  i riferimenti, assicuratevi di allineare questo file tra chi lo utilizza.

------------------------------------------------------------------
5. CONTENUTO DELLA CARTELLA
------------------------------------------------------------------
- gestione-soci-associazione.html : interfaccia web della gestione soci ed escursioni
- server.py                      : server HTTP locale ed endpoint API (/api/soci, /api/escursioni)
- config.example.json            : modello per config.json (URL Web App)
- escursioni_config.example.json : modello per escursioni_config.json
- config.json                    : URL privato della Web App (locale, escluso da git)
- escursioni_config.json         : elenco escursioni con URL privati (locale, escluso da git)
- avvia-soci.sh                 : script di avvio rapido per Linux / macOS
- README.txt                     : questo manuale di istruzioni