# Website BAE — Biovet Agriculture Equipment

Situs company-profile statis: HTML + CSS + JS murni, tanpa build step, tanpa framework.
Live di https://poultry-equipment.biz.id/ (GitHub Pages, repo `lunarcwhite/lunarcwhite.github.io`, branch `main`).

> File `CNAME` berisi `poultry-equipment.biz.id` — JANGAN dihapus, kalau hilang domain custom lepas.

## Struktur

- `index.html`, `pages/`, `artikel/`, `kebijakan-privasi.html` — versi Indonesia (root)
- `en/` — cermin bahasa Inggris, slug sama (`en/produk.html`, `en/article/...`)
- `assets/img/` — gambar `.jpg` + `.webp` berpasangan; `assets/css/`, `assets/js/`
- `sitemap.xml`, `robots.txt`, `404.html`, `favicon.ico`

## Cara update

1. Preview lokal: `python -m http.server` lalu buka `http://localhost:8000`.
2. Edit file → `git add -A` → `git commit -m "..."` → `git push` → live ±1 menit.

## Konvensi (jangan dilanggar)

- Gambar tampil pakai `<picture>` (`webp` dulu, `jpg` fallback) + `loading="lazy"`, kecuali hero (`fetchpriority="high"`).
- Setiap halaman baru: daftarkan di `sitemap.xml`, tautkan dari footer, pasang `canonical` + `hreflang` ID/EN, dan cantumkan snippet beacon Cloudflare (lihat halaman artikel mana pun).
- Teks ID/EN di halaman utama via atribut `data-en`; halaman `en/` file terpisah.

## Operasional

- Analitik, Search Console, GA4 opsional: [PANDUAN-ONLINE.md](PANDUAN-ONLINE.md).
- Butuh dari klien (kapasitas, alamat, sosmed): [TODO.md](TODO.md) — file ini di-`gitignore`, tidak ikut push.
