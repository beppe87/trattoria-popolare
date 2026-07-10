# Trattoria Popolare - sito statico

## File da pubblicare su GitHub Pages

Carica nella root del repository:

```text
index.html
styles.css
script.js
assets/
data/
```

## Aggiornare gli eventi

Modifica solo:

```text
data/eventi.csv
```

Colonne obbligatorie:

```text
DATA,ORA,EVENTO
```

Esempio:

```csv
DATA,ORA,EVENTO
MER 24 GIU,19:30,Valeria Verdolini: Abolire l'impossibile.
VEN 26 GIU,19:30,"W L'ANARCOSINDACALISMO! Con Lia Ratta, Anna Gussetti, Angelo Mulè."
```

Salva il CSV in UTF-8 se possibile. Il sito prova comunque a leggere anche Windows-1252/ANSI.

## Logo

Logo attivo:

```text
assets/logo.png
```

È stato esportato dall'SVG originale:
- nero mantenuto nero;
- rosso trasformato in bianco;
- sfondo trasparente.

Backup:
```text
assets/logo-source.svg
assets/logo-original-color.svg
```

## Footer legale

Nel file `index.html` sostituisci:

```text
Associazione [DENOMINAZIONE LEGALE]
C.F. [INSERIRE]
P.IVA [INSERIRE SE PRESENTE]
```

Se il sito va intestato a una cooperativa/società, il footer va completato con i dati societari corretti.
