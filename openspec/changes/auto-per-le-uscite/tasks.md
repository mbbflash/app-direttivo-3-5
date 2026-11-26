## 1. Database e dati

- [x] 1.1 In `docs/js/clouddb.js` aggiungere il tipo `auto` con la scheda `Auto_Escursioni` (creata con le intestazioni se manca, letta nella `batchGet` iniziale, impostazioni in JSON); in `docs/js/app.js` descrizione leggibile delle righe e cache locale
- [x] 1.2 Lettura dal foglio risposte di città, automunito, mezzo a disposizione, posti, "direttamente alla partenza" e "con chi sei in auto", senza scegliere colonne; esclusione dei disdetti

## 2. Calcolo (v2.6.1, semplificato)

- [x] 2.1 Auto dal ritrovo: minimo di auto che bastano, ordine di scelta di chi guida, compagni di viaggio insieme, avviso se i posti non bastano
- [x] 2.2 Elenco "Direttamente alla partenza" ed elenco per città "chi parte da dove"
- [x] 2.3 Ritrovo dalla scheda tecnica, altrimenti da scegliere (nessun predefinito); cambio a mano
- [x] 2.4 Togliere distanze, posizioni dei paesi, deviazioni, scelte di strada, zone e proposta di Claude della 2.6.0

## 3. Interfaccia

- [x] 3.1 Sezione "Auto per l'uscita": ritrovo e numeri in cima, auto dal ritrovo come schede con posti e menu "Fai guidare …", direttamente alla partenza, chi parte da dove per città, riquadro chiuso "Correggi a mano"
- [x] 3.2 "Copia riepilogo per il gruppo"
- [x] 3.3 Dati di prova in `docs/js/demo.js` (domande sull'auto, posti, ritrovo/partenza, iscritti inventati) e verifica in `?demo=1` senza errori in console
- [x] 3.4 README: funzione nella scheda Escursioni e scheda `Auto_Escursioni` nella tabella "Dove finiscono i dati"

## 4. Equilibrio e posti (v2.6.2)

- [x] 4.1 Domanda sui posti con scelta "4 posti" / "5 posti" (chi guida compreso) nello script e nella lettura dell'app; "Correggi a mano" con auto da 4 o 5 posti
- [x] 4.2 Passeggeri distribuiti in modo equilibrato; nessun guidatore da solo se può salire in un'altra auto; verificare in `?demo=1`

- [x] 4.3 Ritrovi intermedi: menu per città "al ritrovo principale / si ritrovano a …", auto formate per ogni punto, riepilogo per punto; verificare in `?demo=1`

- [x] 4.4 Passaggi fino al ritrovo scelti dalla schermata principale; passaggi e ritrovi intermedi abituali con cambio per singola uscita ed elenco "Abitudini"; verificare in `?demo=1`

- [x] 4.5 v2.7.0: schermata dell'uscita ridotta a ritrovo e auto; scheda del partecipante (ritrovo abituale, passaggio abituale, solo per questa uscita); sezione "Auto per le uscite" nella pagina del socio; tolti menu per città, "chi parte da dove" e lista abitudini; verificare in `?demo=1`

- [x] 4.6 v2.7.1: gruppi "Partono da …" visibili; trasformazione delle scelte 2.6; abitudini trovate anche per nome; riga "dove si trova ora" nella scheda; ritrovo intermedio senza auto → principale; abitudini reciproche; "con …" anche verso chi non guida; verificare in `?demo=1`

- [x] 4.7 Auto dai ritrovi intermedi che proseguono e si riempiono al principale; ricerca per nome del compagno abituale (scheda e pagina del socio); compagno abituale legato alla città; suggerimenti stesso comune o entro 10 km

- [x] 4.8 v2.7.2: auto tutte da 5 posti; scheda corta ("Viaggia con", "Si ritrova a", "Questa volta è diverso?"); suggerimenti in vista con Accetta/✕; ritrovi intermedi di base via ritrovo principale con scelta "direttamente alla partenza"; ↪ al posto delle scritte; niente contatori; "Rifai da capo"; "con …" solo verso chi mette l'auto a disposizione; script senza domanda sui posti

- [x] 4.9 Auto stabili dopo le modifiche (scelte salvate con l'uscita, uguali per tutto il direttivo); spunta "Ha la priorità alla guida" in scheda e pagina del socio

- [x] 4.10 Ultima risposta per chi compila più volte, righe vuote ignorate; schede dei partecipanti una riga per persona (`_p:`) con trasformazione di `_persone`
- [x] 4.11 Interfaccia: riquadro "Auto fissate" con "Rifai da capo", passeggeri del ritrovo principale elencati a parte (niente simbolo ↪), intestazioni "Si trovano a …"
- [x] 4.12 v2.7.3: vista in due tappe (punti intermedi, poi "In partenza da" con tutte le auto complete)
- [x] 4.13 v2.7.4: chi ha l'abitudine di viaggiare con un altro può guidare se servono auto (prima chi ha la priorità)
- [x] 4.14 v2.7.5: il ritrovo intermedio della persona prevale sul compagno abituale che parte da un altro punto; nomi dei ritrovi normalizzati
- [x] 4.15 v2.7.5: suggerimenti di ritrovo intermedio dalla città; ritrovo abituale legato alla città di partenza (`rc`)

## 5. Rilascio

- [x] 5.1 Versione 2.6.0 (config, `?v=`, cache, version.json, badge)
- [x] 5.2 Versione 2.6.1 (config, `?v=`, cache, version.json, badge)
- [x] 5.3 Versione 2.6.2 (config, `?v=`, cache, version.json, badge)
- [x] 5.3b Versione 2.6.3 (config, `?v=`, cache, version.json, badge)
- [x] 5.3c Versione 2.7.0 (config, `?v=`, cache, version.json, badge)
- [x] 5.3d Versione 2.7.2 (config, `?v=`, cache, version.json, badge; la 2.7.1 non è stata pubblicata)
- [x] 5.4 Operazione `aggiungi_domande_auto` in `apps-script/Codice.gs` e istruzioni in SETUP-APPS-SCRIPT.md
- [ ] 5.5 Incollare il nuovo `Codice.gs` nell'editor Apps Script ed eseguire una volta `aggiungiDomandeAuto`; controllare il template
- [ ] 5.6 Dopo il push, prova con login sui dati veri: aprire un'uscita con iscrizioni, controllare che le domande del modulo siano riconosciute e che la scheda `Auto_Escursioni` venga creata alla prima correzione

## Workflow follow-up

- Archiviare questa change (`openspec archive auto-per-le-uscite`) dopo la prova con i dati veri.
