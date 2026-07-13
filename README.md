# Trattoria Popolare - sito statico

## Eventi futuri e passati

Il sito ha già due sezioni:

```text
Prossimi eventi
Eventi passati
```

Si gestisce tutto da un solo CSV/foglio.

## Aggiornare gli eventi

Modifica solo:

```text
data/eventi.csv
```

Colonne:

```text
DATA,ORA,EVENTO,LINK,MOSTRA
```

- `DATA`: obbligatoria, formato `YYYY-MM-DD`, esempio `2026-06-24`.
- `ORA`: obbligatoria, esempio `19:30`.
- `EVENTO`: obbligatoria.
- `LINK`: opzionale. Se compilato, tutta la riga diventa cliccabile.
- `MOSTRA`: opzionale. Usa `si`; se scrivi `no`, la riga resta nel foglio ma non appare.

Il sito divide automaticamente:

```text
DATA >= oggi → Prossimi eventi
DATA < oggi  → Eventi passati
```

A schermo la data viene formattata automaticamente, esempio:

```text
MER 24 GIU
```

## Google Sheet

Quando userete Google Sheet, il foglio dovrà avere le stesse colonne:

```text
DATA | ORA | EVENTO | LINK | MOSTRA
```

Poi nel file `script.js` basterà sostituire:

```js
const EVENTS_CSV_URL = "data/eventi.csv";
```

con il link CSV pubblicato del Google Sheet.

## Footer legale

Footer impostato su:

```text
ASSOCIAZIONE ARCI TRAVERSO
P.IVA: 09009060964
C.F.: 97593060151
```

## Logo

Logo attivo:

```text
assets/logo.png
```

È stato esportato dall'SVG originale:
- nero mantenuto nero;
- rosso trasformato in bianco;
- sfondo trasparente.


## Google Sheet collegato

Questo pacchetto legge già il foglio:

```text
https://docs.google.com/spreadsheets/d/1XH-7Ybu7jMdrivr-IArc9lSifkRflmAr8yBI0kwJs6I/edit
```

Nel file `script.js` sono impostati:

```js
const GOOGLE_SHEET_ID = "1XH-7Ybu7jMdrivr-IArc9lSifkRflmAr8yBI0kwJs6I";
const GOOGLE_SHEET_GID = "0";
```

Per farlo funzionare online, il foglio deve essere pubblico in lettura:

```text
Condividi → Accesso generale → Chiunque abbia il link → Visualizzatore
```

Non usare `Editor` pubblico. Gli editor vanno aggiunti uno per uno.
