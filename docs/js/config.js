// Configurazione pubblica di APP Direttivo 3/5.
// Qui NON ci sono dati riservati: i fogli vengono cercati per nome nel Drive
// dell'account con cui si accede, e solo chi ha accesso a quei fogli vede i dati.
window.APP_CONFIG = {
  appName: "APP Direttivo 3/5",
  version: "2.5.2",

  // OAuth Client ID creato nella Google Cloud Console (vedi SETUP-GOOGLE.md).
  // Il Client ID è pubblico per natura: non dà accesso a niente senza login.
  googleClientId: "697558119105-ne8rmvk3639k89pp3r263sgnrhm56165.apps.googleusercontent.com",

  // Account con cui è consentito entrare nell'app.
  allowedAccounts: ["trequintitrekking@gmail.com"],

  // Nomi dei fogli Google da cercare nel Drive dell'account loggato.
  libroSociName: "2 - Libro Soci e Volontari",
  libroSociSheet: "Libro Soci",
  databaseName: "NON TOCCARE - DATABASE APP DI GESTIONE",
  // Fogli risposte delle uscite: "Iscrizioni AAAA.MM.GG - Nome (Risposte)" oppure
  // "Form Iscrizione AAAA.MM.GG - "Nome" (Risposte)". Dopo il prefisso ci deve essere la data.
  escursioniNamePrefixes: ["Iscrizioni", "Form Iscrizione"],

  // Foglio delle presenze effettive (statistiche): una scheda per anno, es. "DatiEscursioni2026".
  statsName: "Tre Quinti Wrapped - Foglio Calcolo",
  statsSheetPrefix: "DatiEscursioni",

  // Foglio delle schede tecniche dei percorsi (per l'assistente "Prossima uscita").
  // Si cerca per inizio del nome, perché il titolo contiene gli anni, es. "(2024-2026)".
  schedeNamePrefix: "Tre Quinti Trekking - Schede Tecniche Escursioni",
  // Nomi brevi dei punti di ritrovo (per il filtro): tutte le parole di "match" devono comparire.
  ritrovoAlias: [
    { match: ["penny"], label: "Penny Market Borgo a Mozzano" },
    { match: ["mc", "lammari"], label: "McDonald's Lammari" },
    { match: ["mc", "lucca"], label: "McDonald's Lucca" },
    { match: ["camaiore"], label: "Stadio di Camaiore" },
    { match: ["diecimo"], label: "Stazione di Diecimo" },
    { match: ["millibar"], label: "Bar Millibar" }
  ],

  // Foglio delle risposte al modulo di iscrizione all'associazione (per le notifiche dei nuovi soci).
  iscrizioniName: "3 - Modulo Iscrizione Tre Quinti Trekking APS (Risposte)"
};
