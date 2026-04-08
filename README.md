# HP Mostar Interaktivni Kutak

Statična kiosk aplikacija za 86" 4K ekran s dvije igre:

- `Memory`
- `Pitalica`

Na kraju obje igre korisnik dolazi na završni ekran s QR kodovima za:

- `PostBox Android`
- `PostBox iPhone`
- `Viber Brza pošta 1323`

## Pokretanje

Najjednostavnije:

```bash
npm install
npm run generate:qr
npm run serve
```

Zatim otvoriti:

```text
http://localhost:8080
```

Ako se aplikacija otvara direktno kao lokalni file, osnovni HTML/CSS/JS će raditi, ali je lokalni server sigurnija opcija za kiosk setup.

## Gdje se mijenja sadržaj

Glavna konfiguracija je u:

`assets/data/config.js`

Tamo se mogu mijenjati:

- uvodni tekstovi
- memory kartice
- pitanja i odgovori
- QR kartice i fallback URL-ovi

## QR kodovi

QR SVG datoteke se generiraju skriptom:

```bash
npm run generate:qr
```

Ako promijeniš URL za neki QR, nakon toga ponovno pokreni ovu skriptu.

## Sajamski detalji

- Brand font: `Raleway`
- Primarna boja: `#FFED00`
- Vidljiv `Reset` gumb gore desno
- Auto reset nakon neaktivnosti
