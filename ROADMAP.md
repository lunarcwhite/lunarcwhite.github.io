# ROADMAP Website BAE — WordPress di STB (Armbian + aaPanel)

Status awal 2026-09-10: situs statis HTML jadi dan live di GitHub Pages (`poultry-equipment.biz.id`), SEO fondasi manual (canonical, hreflang ID/EN, sitemap.xml, JSON-LD), Cloudflare Analytics aktif, 4 artikel ID + 4 EN. Lihat [PANDUAN-ONLINE.md](PANDUAN-ONLINE.md) dan [TODO.md](TODO.md) (gitignored).

## Keputusan arsitektur (final)

- **Updater = non-teknis → butuh CMS dengan peran Editor.** Situs statis dibekukan, tidak tambah fitur di sana selain perbaikan kritis.
- **Stack: WordPress + Nginx + MariaDB + PHP 8.1 di STB Armbian via aaPanel.** Theme ringan (GeneratePress / Astra) + Gutenberg saja. Tanpa page builder berat, tanpa CRUD custom.
- **Plugin minimal (jangan tambah di luar daftar tanpa alasan):** Polylang (ID/EN + ZH nanti), RankMath (SEO + sitemap + schema + GA4), UpdraftPlus (backup ke Drive), Redirection (301 URL lama → baru), Disable XML-RPC + Limit Login / 2FA.
- **Dilarang di STB:** Elementor/Divi, slider animasi, plugin statistik duplikat, plugin backup ganda. STB kentang + plugin rakus = situs lemot.
- **GitHub Pages lama tetap hidup sebagai fallback** sampai WordPress stabil 30 hari, baru dimatikan.

## Fase 0 — Infra STB (pemilik: dev, ±1 hari)

- [ ] Cek spek STB (minimal nyaman: RAM 4 GB, storage SSD/USB3 — JANGAN DB di SD card), cek ISP: IP publik atau CGNAT?
- [ ] Install Armbian + aaPanel, stack LNMP (Nginx, MariaDB 10.x, PHP 8.1 + opcache)
- [ ] Domain: jika CGNAT → pasang Cloudflare Tunnel (`cloudflared`) di STB; jika IP publik → A record + port forward 80/443
- [ ] SSL Let's Encrypt via aaPanel, auto-renew; aktifkan firewall aaPanel + fail2ban
- [ ] UPS mini + pendingin; STB mati = situs mati
- [ ] Selesai bila: `https://poultry-equipment.biz.id` (staging subdomain dulu, mis. `baru.`) sudah HTTPS dari internet

## Fase 1 — WordPress + migrasi konten (pemilik: dev, ±2-3 hari)

- [ ] Install WordPress di aaPanel (1 site, 1 DB), permalink: Posts `/%category%/%postname%/` dengan kategori `artikel`, Pages polos (`/produk/`, `/kebijakan-privasi/`)
- [ ] Polylang: bahasa ID (default) + EN, format URL `/en/...` agar sama seperti situs lama
- [ ] Migrasi konten: 2 halaman produk (Tipe H, Tipe A), 4 artikel + terjemahan EN, halaman privasi, blok kontak/WA. Gambar dikompres ulang (WebP, max 1600px) via Media Library
- [ ] Redirect 301 (plugin Redirection) — WAJIB agar SEO lama tidak hangus:
  - `/pages/produk.html` → `/produk/`
  - `/artikel/*.html` → `/artikel/*/`
  - `/en/produk.html` → `/en/produk/` (dst. pola sama)
- [ ] Bekukan situs statis: commit terakhir + catat hash, jadikan arsip fallback
- [ ] Selesai bila: semua URL lama dicek satu per satu, 301 jalan, tidak ada 404 dari daftar URL lama

## Fase 2 — Peran + SOP editor non-teknis = "CRUD" (pemilik: dev bikin, BAE pakai, ±0,5 hari)

- [ ] Akun: 1 Admin (dev) + 1 Editor per staf BAE (jangan akun bersama). Editor BOLEH: Posts/Pages/Media. Editor TIDAK BOLEH: install theme/plugin, edit menu, update core
- [ ] `wp-config.php`: `DISALLOW_FILE_EDIT true`, update minor WP otomatis ON, update mayor/plugin manual terjadwal
- [ ] SOP 1 halaman untuk editor (tempel di dinding / PDF): Login → Posts → Add New → tulis → featured image → kategori → Save Draft → (Admin review) → Publish → cek di HP. Aturan: judul < 60 karakter, 1 gambar utama wajib alt-text, link WA wajib dari tombol pola, tidak copy-paste dari Word (paste as plain text)
- [ ] Training 1 jam via screen-share + 1 artikel latihan (draft, tidak publish)
- [ ] Selesai bila: editor menerbitkan 1 artikel latihan TANPA bantuan dev

## Fase 3 — SEO pasca-migrasi (pemilik: dev, ±2 jam, setelah Fase 1)

- [ ] RankMath: judul/deskripsi diimpor dari situs lama, sitemap XML otomatis, schema Article/FAQ/Product, OG/Twitter
- [ ] Search Console: submit sitemap BARU (`/sitemap_index.xml`), minta index ulang URL utama, monitor Coverage 7 hari (pastikan 301 terbaca, tidak ada redirect chain)
- [ ] Selesai bila: sitemap Success, URL baru terindex, URL `.html` lama tidak lagi muncul di hasil

## Fase 4 — Tracking kunjungan (pemilik: dev, ±2 jam, setelah Fase 1)

- [ ] GA4 via RankMath (atau Site Kit — pilih SATU, jangan dua). Event: `whatsapp_click` (bawa `page_location`) + view halaman produk
- [ ] Update halaman Kebijakan Privasi (ID+EN, via Polylang): nyatakan GA4 aktif + data apa yang dikumpulkan, hapus kalimat "GA4 belum aktif" warisan situs statis
- [ ] Selesai bila: Realtime GA4 mencatat kunjungan + klik WA dari 2 halaman berbeda

Tanpa fase ini, ads = bakar uang tanpa tahu konversi.

## Fase 5 — Direct WhatsApp (pemilik: BAE + dev, paralel Fase 4)

Web (dev, sekali seting sebagai Reusable Block Gutenberg):

- [ ] Tombol mengambang + blok CTA akhir artikel, `text=` pra-isi per konteks: `Halo BAE, saya dari [Judul Halaman], ingin tanya tentang [Topik]`
- [ ] Semua link `wa.me` terukur event Fase 4. Jangan tambah tombol baru

Non-web (BAE, dampak lebih besar dari kode):

- [ ] Profil WhatsApp Business + katalog + jam operasional
- [ ] 3 balasan cepat: minta populasi/ukuran lahan/tipe; kirim brosur; jadwal survei
- [ ] Selesai bila: tiap chat masuk ketahuan asalnya (teks pra-isi), balasan < 5 menit jam kerja

## Fase 6 — Konten rutin, kini oleh editor (pemilik: BAE, dev hanya review)

Tutup lubang lama dulu ([TODO.md](TODO.md) masih menagih dari klien):

- [ ] Kapasitas per set (ekor) + ukuran P x L x T; kapasitas feeding/watering/egg/manure per set; alamat + email footer; URL FB/TikTok exact; foto event

Rutinitas (1 artikel/bulan ID + duplikat EN via Polylang):

- [ ] Sumber: `Buku BAE Translate` + `Materi website.pdf`. Pola terbukti: harga, perbandingan, tips operasional
- [ ] Refresh artikel tiap 6 bulan (angka, foto). Tidak ada lagi edit `sitemap.xml`/hreflang manual — otomatis
- [ ] Selesai bila: tidak ada klaim kapasitas tanpa angka

## Fase 7 — Ads, uji kecil saja (setelah Fase 4 + 5 beres, pemilik: BAE)

- [ ] Google Search (kandang ayam otomatis, kandang ayam petelur, kandang tipe H). 1 kampanye → 1 halaman arahan (`/produk/` + UTM)
- [ ] Konversi = chat WA qualified (ada populasi/lahan/tipe), BUKAN klik
- [ ] Kriteria bunuh: 2-4 minggu tanpa chat qualified → pause, alihkan ke portofolio YouTube/TikTok/IG (gratis)
- [ ] Selesai bila: tahu biaya per chat qualified dari 1 kampanye uji

## Fase 8 — Mandarin via Polylang (ditunda sampai ada bukti permintaan)

Keputusan: TIDAK ada direktori `zh/` manual. Begitu pemicu terpenuhi, tambah bahasa ZH di Polylang (1 klik) lalu terjemahkan beranda + produk + kontak dulu, artikel menyusul.

- [ ] Pemicu: trafik ZH nyata di GA4 ATAU permintaan buyer Mandarin berulang
- [ ] Selesai bila: ada URL `/zh/...` yang bisa dikirim ke calon buyer

## Operasional STB (jadwal tetap, pemilik: dev)

- [ ] Backup 2 lapis: aaPanel terjadwal harian (retensi 7 hari) + UpdraftPlus ke Google Drive (mingguan, retensi 4). Tes restore 1x sebelum go-live
- [ ] Update: plugin dicek bulanan jam sepi, snapshot/backup dulu baru update; log tiap update
- [ ] Keamanan: 2FA admin, ganti URL login bila perlu, XML-RPC mati, komentar mati (situs company profile tidak butuh komentar)
- [ ] Monitoring: UptimeRobot gratis (alert WA/email bila down) + cek suhu/disk STB bulanan
- [ ] Go-live: pointing domain ke STB (atau Tunnel) → pantau 30 hari → baru matikan GitHub Pages

## Urutan + dependensi

```
F0 Infra STB ──→ F1 WP + migrasi ──→ F3 SEO ──→ F4 Tracking ──→ F5 WA ──→ F7 Ads (uji)
                        │                │
                        ├→ F2 SOP editor ┘
                        └→ F6 Konten rutin (editor mandiri, mulai setelah F2 lulus)
F8 Mandarin: kapan saja setelah F1, jika pemicu terpenuhi (murah via Polylang)
Fallback GitHub Pages hidup sampai 30 hari pasca go-live
```

## Metrik (cek bulanan)

- Search Console: halaman terindex, klik organik, query teratas, error 404/redirect
- GA4: pengunjung, sumber, klik WA per halaman
- WA: chat masuk, chat qualified, closing
- Operasional: uptime STB, umur backup terakhir, status update plugin
- Konten: artikel terbit ID+EN oleh editor tanpa dev, artikel direfresh
