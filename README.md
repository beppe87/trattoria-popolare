# Trattoria Popolare - sito statico

Sito one-page statico per GitHub Pages.

## Aggiornare gli eventi

Metodo base: modifica `data/eventi.csv` con colonne:

```csv
DATA,ORA,EVENTO
12 LUG,20:30,Cena popolare + musica live
```

Metodo consigliato: collega un Google Sheet pubblicato come CSV e incolla il link in `script.js`:

```js
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv";
```

Chi aggiorna gli eventi dovrà solo compilare il Google Sheet con colonne `DATA | ORA | EVENTO`.

## Sostituire il logo

Sostituisci il file:

```text
assets/logo.png
```

Mantieni lo stesso nome file per non dover modificare il codice.

## Pubblicazione GitHub Pages

Carica questi file nella root del repository, poi:

Settings → Pages → Deploy from a branch → main → /root → Save.
