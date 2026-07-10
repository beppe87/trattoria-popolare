# Trattoria Popolare - sito statico

## Aggiornare eventi
Modifica solo `data/eventi.csv` con colonne:

```csv
DATA,ORA,EVENTO
LUN 24 GIU,20:30,Cena popolare + musica live
```

Gli eventi non sono scritti nel JavaScript.

## Logo
- `assets/logo.png` = prova bicolore nero/bianco
- `assets/logo-white.png` = versione tutta bianca precedente
- `assets/logo-bicolore.png` = copia della prova bicolore

Per tornare al logo bianco: rinomina `logo-white.png` in `logo.png`.

## Versione v8
- Eventi letti solo da `data/eventi.csv`.
- Mobile: colonna DATA più larga, ORA più stretta/allineata a destra.
- Logo bicolore corretto: parti nere nere, parti rosse trasformate in bianco, con trasparenza PNG.
