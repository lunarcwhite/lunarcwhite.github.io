# Website BAE online 100% gratis

## 1. Hosting: Cloudflare Pages (±10 menit)

1. Daftar di `dash.cloudflare.com` (gratis, cuma email).
2. Menu **Workers & Pages → Create → Pages → Upload assets**.
3. Nama project mis. `bae` → alamat jadi `https://bae.pages.dev`.
4. Upload **isi folder `bae-site`** (file `index.html`, `robots.txt`, `sitemap.xml`, folder `assets`).
5. Setiap update: upload ulang / drag-and-drop lagi.

Lazier alternative: `app.netlify.com/drop` — drag folder, langsung online tanpa akun dulu.

## 2. Ganti domain sementara (wajib, 5 menit)

Semua tulisan `GANTI-DOMAIN.pages.dev` ganti dengan alamat aslimu:

- `robots.txt` → baris `Sitemap:`
- `sitemap.xml` → 2 baris `<loc>`
- `index.html` → `canonical` + `og:image`
- `assets/pages/produk.html` → `canonical` + `og:image`

Cari `GANTI-DOMAIN` di semua file (VS Code: Ctrl+Shift+F), replace all.

## 3. Statistik pengunjung (pilih 1, gratis)

**A. Cloudflare Web Analytics (paling malas, tanpa cookie banner):**
1. Di dashboard Cloudflare → **Web Analytics → Add site** → masukkan `bae.pages.dev`.
2. Copy **token** → di `index.html` + `produk.html` hapus `<!--` `-->` di blok Cloudflare, ganti `GANTI-TOKEN`.
3. Lihat pengunjung di dashboard Cloudflare (harian/mingguan, halaman populer).

**B. Google Analytics 4 (lebih detail: sumber WA/IG, HP vs desktop):**
1. Daftar `analytics.google.com` → buat properti → copy **Measurement ID** (`G-...`).
2. Di `index.html` + `produk.html` aktifkan blok GA4, ganti `G-XXXXXXXXXX` (2 tempat per file).
3. Lihat di **Reports → Realtime / Traffic acquisition**.

Boleh pasang dua-duanya.

## 4. Terindex Google (±15 menit + tunggu 1-14 hari)

1. Buka `search.google.com/search-console` → tambah properti URL `https://bae.pages.dev`.
2. Verifikasi: pilih metode **tag HTML** → tempel tag di `<head>` kedua file → upload ulang → klik Verify.
3. Menu **Sitemaps → Add sitemap** → isi `sitemap.xml` → Submit.
4. Cek 3-7 hari kemudian di Search Console → Pages: berapa halaman terindex.
5. Tes cepat kapan saja: di Google ketik `site:bae.pages.dev`.

## 5. Kalau nanti beli domain (.com ~Rp150rb/th)

1. Beli di Cloudflare Registrar / Niagahoster.
2. Cloudflare Pages → **Custom domains → Setup** → ikut wizard (DNS otomatis).
3. Ulangi langkah 2 (ganti domain) + daftarkan domain baru ke Search Console + GA4.
4. Domain lama `pages.dev` tetap jalan dan redirect otomatis — tidak perlu hapus.

## Checklist

- [ ] Upload ke Cloudflare Pages → dapat URL
- [ ] Replace `GANTI-DOMAIN` di 4 file
- [ ] Aktifkan 1 statistik (Cloudflare atau GA4)
- [ ] Daftar Search Console + submit `sitemap.xml`
- [ ] Tunggu index, cek `site:domain-kamu`
