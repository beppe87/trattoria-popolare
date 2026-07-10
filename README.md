# Trattoria Popolare - sito statico

Sito one-page rosso/bianco con logo, tabellone eventi e footer.

## File principali

- `index.html` struttura pagina
- `styles.css` grafica
- `script.js` caricamento eventi
- `assets/logo.svg` logo temporaneo/vettoriale
- `data/eventi.csv` esempio contenuti

## Eventi da Google Sheet

1. Crea un Google Sheet con queste colonne esatte:

```text
DATA | ORA | EVENTO
```

2. Inserisci gli eventi, una riga per evento.
3. Vai su `File > Condividi > Pubblica sul web`.
4. Scegli formato `CSV`.
5. Copia il link pubblicato.
6. Apri `script.js` e incolla il link qui:

```js
const SHEET_CSV_URL = "INCOLLA_QUI_IL_LINK_CSV";
```

Se `SHEET_CSV_URL` resta vuoto, il sito usa gli eventi di esempio.

## Pubblicazione GitHub Pages

Carica tutti i file nella root del repository, poi abilita GitHub Pages da `Settings > Pages` usando branch `main` e folder `/root`.
