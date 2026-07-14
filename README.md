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
DATA,ORA,EVENTO,LINK
```

- `DATA`: obbligatoria, formato `YYYY-MM-DD`, esempio `2026-06-24`.
- `ORA`: obbligatoria, esempio `19:30`.
- `EVENTO`: obbligatoria.
- `LINK`: opzionale. Se compilato, tutta la riga diventa cliccabile.

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
DATA | ORA | EVENTO | LINK
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


## Link eventi su mobile

I link evento aprono in una nuova scheda.
Se il browser mobile blocca l'apertura della nuova scheda, il sito usa un fallback e apre il link nella scheda corrente.

Nel Google Sheet la colonna `LINK` deve contenere il link completo in chiaro:

```text
https://www.facebook.com/events/123456789
```


## Eventi passati: Mostra altri

La sezione `Eventi passati` mostra inizialmente 10 righe.
Se ci sono altri eventi, compare il bottone:

```text
Mostra altri eventi
```

Ogni click aggiunge altre 10 righe.
Il Google Sheet resta unico e non cambia nulla per chi compila.


## Favicon

La favicon della scheda browser è:

```text
assets/favicon.png
```

È ricavata dal simbolo del logo originale a colori, senza scritta, per essere più leggibile nella tab.


## Fix link eventi v23

Corretto comportamento dei link evento:
- desktop: apre solo nuova scheda;
- mobile: nuova scheda se possibile;
- fallback nella stessa scheda solo se la nuova scheda viene bloccata.


## Colonne attive Google Sheet

Da questa versione le colonne sono solo:

```text
DATA | ORA | EVENTO | LINK
```

Se una riga è presente e ha DATA/ORA/EVENTO compilati, viene mostrata.
La colonna `LINK` è opzionale: se compilata, rende cliccabile la riga.


## Fix link eventi mobile v25

Comportamento link eventi:
- Desktop: apre in nuova scheda.
- Mobile: apre nella stessa scheda, perché è il comportamento più affidabile su Safari/Chrome mobile e browser interni.


## Link Google Maps v26

Il link dell'indirizzo nei contatti ora cerca il locale per nome + indirizzo:

```text
Trattoria Popolare Arci Traverso Via Antonio Pacinotti 4 20155 Milano
```

URL usato:
```text
https://www.google.com/maps/search/?api=1&query=Trattoria%20Popolare%20Arci%20Traverso%20Via%20Antonio%20Pacinotti%204%2020155%20Milano
```


## Fix link eventi v29

Questa versione riprende il comportamento che funzionava su mobile, ma corregge il problema desktop.

Comportamento:
- Desktop: apre solo nuova scheda, senza fallback sulla scheda corrente.
- Mobile: prova nuova scheda/app Facebook; se bloccata, apre nella scheda corrente.
