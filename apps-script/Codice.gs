/**
 * APP Direttivo 3/5 - Automazioni (Apps Script collegato al foglio
 * "NON TOCCARE - DATABASE APP DI GESTIONE").
 *
 * L'app scrive le richieste nella scheda "Richieste"; questo script le esegue
 * con l'account dell'associazione. Installazione e aggiornamento: SETUP-APPS-SCRIPT.md.
 *
 * Qui NON ci sono ID di file, URL privati o token: i file si trovano per nome.
 */

// Nome esatto del form da clonare per ogni nuova uscita.
var TEMPLATE_NAME = '[TEMPLATE] Form Iscrizione aaaa.mm.gg - "Nome Escursione"';

var SHEET_RICHIESTE = 'Richieste';
var HEADERS = ['id', 'tipo', 'parametri', 'stato', 'risultato', 'errore', 'creato_il', 'creato_da', 'completato_il'];
var COL = { id: 1, tipo: 2, parametri: 3, stato: 4, risultato: 5, errore: 6, creato_il: 7, creato_da: 8, completato_il: 9 };
var MAX_IN_CORSO_MS = 10 * 60 * 1000;
var GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];

// Operazioni disponibili: tipo di richiesta -> funzione(parametri) che restituisce il risultato.
var OPERAZIONI = {
  crea_uscita: creaUscita
};

/** Da eseguire una volta dall'editor: chiede i permessi e crea l'attivatore ogni minuto. */
function installa() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'esegui') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('esegui').timeBased().everyMinutes(1).create();
  schedaRichieste_();
  Logger.log('Installato: attivatore "esegui" ogni minuto.');
}

/** Chiamata dall'attivatore: esegue le richieste in attesa, una alla volta. */
function esegui() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return; // un'altra esecuzione sta già lavorando
  try {
    var sheet = schedaRichieste_();
    var last = sheet.getLastRow();
    if (last < 2) return;
    var values = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
    var props = PropertiesService.getScriptProperties();

    for (var i = 0; i < values.length; i++) {
      var row = i + 2;
      var id = String(values[i][COL.id - 1] || '').trim();
      var stato = String(values[i][COL.stato - 1] || '').trim();
      if (!id) continue;

      if (stato === 'in_corso') {
        var inizio = Number(props.getProperty('inizio_' + id) || 0);
        if (!inizio || Date.now() - inizio > MAX_IN_CORSO_MS) {
          chiudi_(sheet, row, 'errore', '', 'Esecuzione interrotta: riprova');
          props.deleteProperty('inizio_' + id);
        }
        continue;
      }
      if (stato !== 'in_attesa') continue;

      sheet.getRange(row, COL.stato).setValue('in_corso');
      props.setProperty('inizio_' + id, String(Date.now()));
      SpreadsheetApp.flush();

      var tipo = String(values[i][COL.tipo - 1] || '').trim();
      try {
        var operazione = OPERAZIONI[tipo];
        if (!operazione) throw new Error('Tipo di richiesta sconosciuto: "' + tipo + '". Aggiorna lo script (SETUP-APPS-SCRIPT.md).');
        var parametri;
        try { parametri = JSON.parse(String(values[i][COL.parametri - 1] || '{}')); }
        catch (e) { throw new Error('Parametri della richiesta non leggibili.'); }
        var risultato = operazione(parametri);
        chiudi_(sheet, row, 'fatto', JSON.stringify(risultato), '');
      } catch (e) {
        chiudi_(sheet, row, 'errore', '', e && e.message ? e.message : String(e));
      }
      props.deleteProperty('inizio_' + id);
      SpreadsheetApp.flush();
    }
  } finally {
    lock.releaseLock();
  }
}

function chiudi_(sheet, row, stato, risultato, errore) {
  sheet.getRange(row, COL.stato, 1, 3).setValues([[stato, risultato, errore]]);
  sheet.getRange(row, COL.completato_il).setValue(Utilities.formatDate(new Date(), 'Europe/Rome', 'dd/MM/yyyy HH:mm:ss'));
}

function schedaRichieste_() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_RICHIESTE);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_RICHIESTE);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ---------------------------------------------------------------------------
// crea_uscita: { nome, data: "AAAA-MM-GG", data_fine: "AAAA-MM-GG" | "" }
// ---------------------------------------------------------------------------

function creaUscita(p) {
  var n = nomiUscita_(p);

  // Template: deve esserci esattamente un form con quel nome.
  var templates = [];
  var it = DriveApp.getFilesByName(TEMPLATE_NAME);
  while (it.hasNext()) {
    var f = it.next();
    if (!f.isTrashed() && f.getMimeType() === MimeType.GOOGLE_FORMS) templates.push(f);
  }
  if (templates.length !== 1) {
    throw new Error((templates.length ? 'Ci sono ' + templates.length + ' form' : 'Non trovo il form') +
      ' con il nome del template: ' + TEMPLATE_NAME + '. Nel Drive ce ne deve essere esattamente uno.');
  }
  var template = templates[0];

  // Niente doppioni: nessun file (non nel cestino) con il nome del form o del foglio.
  [n.formNome, n.foglioNome].forEach(function (nome) {
    var files = DriveApp.getFilesByName(nome);
    while (files.hasNext()) {
      if (!files.next().isTrashed()) throw new Error('Esiste già un file chiamato: ' + nome);
    }
  });

  var parents = template.getParents();
  var cartella = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  var creati = [];
  try {
    // 1. Copia del template: descrizione, domande, sezioni, impostazioni e conferma restano uguali.
    var copia = template.makeCopy(n.formNome, cartella);
    creati.push(copia);
    var form = FormApp.openById(copia.getId());
    form.setTitle(n.titolo);

    // 2. Foglio risposte, nella stessa cartella, collegato al form.
    var ss = SpreadsheetApp.create(n.foglioNome);
    var fileFoglio = DriveApp.getFileById(ss.getId());
    creati.push(fileFoglio);
    fileFoglio.moveTo(cartella);
    var foglioIniziale = ss.getSheets()[0].getSheetId();
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    SpreadsheetApp.flush();

    // 3. Le risposte devono stare nel primo foglio: tolgo quello vuoto iniziale.
    ss = SpreadsheetApp.openById(ss.getId());
    var schede = ss.getSheets();
    if (schede.length > 1) {
      schede.forEach(function (s) { if (s.getSheetId() === foglioIniziale) ss.deleteSheet(s); });
    }

    return {
      form_nome: n.formNome,
      foglio_nome: n.foglioNome,
      link_compilazione: form.getPublishedUrl(),
      link_modifica: form.getEditUrl()
    };
  } catch (e) {
    // Niente form a metà: cestino quello che ho creato in questa richiesta.
    creati.forEach(function (f) { try { f.setTrashed(true); } catch (_) {} });
    throw e;
  }
}

/** Calcola nomi e titolo dell'uscita. Esempio: "giro di prova", 2026-11-22. */
function nomiUscita_(p) {
  var nome = String((p && p.nome) || '').replace(/\s+/g, ' ').trim();
  if (!nome) throw new Error('Manca il nome dell\'escursione.');
  if (/["\/\\]/.test(nome)) throw new Error('Il nome non può contenere virgolette o barre.');

  var d1 = data_(p.data);
  if (!d1) throw new Error('Data non valida: ' + p.data);
  var d2 = p.data_fine ? data_(p.data_fine) : null;
  if (p.data_fine && !d2) throw new Error('Data di fine non valida: ' + p.data_fine);
  if (d2 && d2.time <= d1.time) throw new Error('La data di fine deve essere dopo la data di inizio.');
  if (d2 && (d2.y !== d1.y || d2.m !== d1.m)) throw new Error('Le uscite di più giorni devono stare nello stesso mese.');

  var stamp = d1.y + '.' + pad_(d1.m) + '.' + pad_(d1.d) + (d2 ? '-' + pad_(d2.d) : '');
  var titolo = d2
    ? '✒️ ' + nome + ' - ' + d1.giorno + ' ' + pad_(d1.d) + '/' + pad_(d1.m) + ' e ' + d2.giorno + ' ' + pad_(d2.d) + '/' + pad_(d2.m) + '/' + d2.y
    : '✒️ ' + nome + ' - ' + d1.giorno + ' ' + pad_(d1.d) + '/' + pad_(d1.m) + '/' + d1.y;

  return {
    formNome: 'Form iscrizione ' + stamp + ' - "' + nome + '"',
    foglioNome: 'Iscrizioni ' + stamp + ' - ' + nome + ' (Risposte)',
    titolo: titolo
  };
}

function data_(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  if (!m) return null;
  var y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  var t = Date.UTC(y, mo - 1, d);
  var dt = new Date(t);
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return { y: y, m: mo, d: d, time: t, giorno: GIORNI[dt.getUTCDay()] };
}

function pad_(n) { return (n < 10 ? '0' : '') + n; }

/** Prova dall'editor: mostra nomi e titolo senza creare nulla. */
function provaNomi() {
  Logger.log(JSON.stringify(nomiUscita_({ nome: 'giro di prova', data: '2026-11-22' })));
  Logger.log(JSON.stringify(nomiUscita_({ nome: 'Prado e Cusna', data: '2026-09-05', data_fine: '2026-09-06' })));
  Logger.log(JSON.stringify(nomiUscita_({ nome: 'Cena di Natale', data: '2026-12-25' })));
}
