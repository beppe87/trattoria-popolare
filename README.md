# Trattoria Popolare - sito statico

Versione finale pulita: `v43-clean`.

## Upload

Caricare nella root del sito tutti questi file/cartelle:

```text
index.html
styles.css
script.js
assets/
data/
```

## Google Sheet eventi

Il sito legge gli eventi dal Google Sheet configurato in `script.js`.

Colonne richieste:

```text
DATA | ORA | EVENTO | LINK
```

Regole:

- `DATA`: meglio `YYYY-MM-DD`, esempio `2026-07-18`.
- `ORA`: testo libero, esempio `20:30`.
- `EVENTO`: titolo evento.
- `LINK`: opzionale.
- Se una riga ha `DATA`, `ORA` ed `EVENTO`, viene mostrata.
- La colonna `MOSTRA` non serve più.

## Link Facebook

Usare solo link lunghi evento Facebook, non link corti `fb.me/e/...`.

Formato corretto:

```text
https://www.facebook.com/events/1412314397614563/
```

Formato da evitare:

```text
https://fb.me/e/xxxxxxx
```

Il sito non usa più deep link sperimentali (`fb://`, `intent://`, `m.facebook.com`).
Apre semplicemente il link originale del foglio in nuova scheda: sarà il telefono/browser a gestire l'eventuale apertura dell'app Facebook.

## Eventi passati

Gli eventi passati mostrano inizialmente 10 righe.
Il bottone "Mostra altri eventi" aggiunge 10 righe alla volta.

## Favicon

La favicon della scheda browser è:

```text
assets/favicon.png
```
