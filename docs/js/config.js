// Configurazione pubblica di APP Direttivo 3/5.
// Qui NON ci sono dati riservati: i fogli vengono cercati per nome nel Drive
// dell'account con cui si accede, e solo chi ha accesso a quei fogli vede i dati.
window.APP_CONFIG = {
  appName: "APP Direttivo 3/5",
  version: "2.1.0",

  // OAuth Client ID creato nella Google Cloud Console (vedi SETUP-GOOGLE.md).
  // Il Client ID è pubblico per natura: non dà accesso a niente senza login.
  googleClientId: "697558119105-ne8rmvk3639k89pp3r263sgnrhm56165.apps.googleusercontent.com",

  // Account con cui è consentito entrare nell'app.
  allowedAccounts: ["trequintitrekking@gmail.com"],

  // Nomi dei fogli Google da cercare nel Drive dell'account loggato.
  libroSociName: "2 - Libro Soci e Volontari",
  libroSociSheet: "Libro Soci",
  databaseName: "NON TOCCARE - DATABASE APP DI GESTIONE",
  escursioniNamePrefix: "Form Iscrizione"
};
