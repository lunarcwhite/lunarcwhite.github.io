# Website BAE — status & cara kelola

## Status (2026-09-04): SUDAH ONLINE

- Hosting: **GitHub Pages**, repo `lunarcwhite/lunarcwhite.github.io`, branch `main`
- Live di: `https://lunarcwhite.github.io/` dan `https://poultry-equipment.biz.id/`
- File `CNAME` berisi `poultry-equipment.biz.id` — JANGAN dihapus, kalau hilang domain custom lepas
- Cara update: edit file → `git add -A` → `git commit -m "..."` → `git push` → live ±1 menit

## Statistik pengunjung (Cloudflare Web Analytics — SUDAH AKTIF)

Beacon terpasang di `index.html` + `assets/pages/produk.html`.
Lihat data di `dash.cloudflare.com` → **Web Analytics** (harian/mingguan, halaman populer).
Tanpa cookie banner, gratis.

## Google Analytics 4 (OPSIONAL, lebih detail: sumber WA/IG, HP vs desktop)

1. Daftar `analytics.google.com` → buat properti → copy **Measurement ID** (`G-...`).
2. Di `index.html` + `assets/pages/produk.html`: uncomment blok GA4, ganti `G-XXXXXXXXXX` (2 tempat per file).
3. Commit + push. Lihat di **Reports → Realtime / Traffic acquisition**.

## Terindex Google (BELUM — butuh 15 menit + tunggu 1-14 hari)

1. Buka `search.google.com/search-console` → tambah properti URL `https://poultry-equipment.biz.id/`.
2. Verifikasi: metode **tag HTML** → tempel tag di `<head>` kedua file → commit + push → klik Verify.
3. **Sitemaps → Add sitemap** → isi `sitemap.xml` → Submit.
4. Cek 3-7 hari kemudian di Search Console → Pages: berapa halaman terindex.
5. Tes cepat kapan saja: di Google ketik `site:poultry-equipment.biz.id`.

## Checklist

- [x] Online via GitHub Pages + domain custom
- [x] `robots.txt` + `sitemap.xml` menunjuk domain benar
- [x] Cloudflare Web Analytics aktif
- [ ] GA4 (opsional)
- [ ] Daftar Search Console + submit `sitemap.xml`
- [ ] Tunggu index, cek `site:poultry-equipment.biz.id`
