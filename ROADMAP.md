# ROADMAP Website BAE — WordPress 3 Bahasa di STB (Armbian + aaPanel)

Status awal 2026-09-10: situs statis HTML live di GitHub Pages (`poultry-equipment.biz.id`), SEO fondasi manual (canonical, hreflang ID/EN, sitemap.xml, JSON-LD), Cloudflare Analytics aktif, 4 artikel ID + 4 EN + indeks, privasi ID + EN. Lihat [PANDUAN-ONLINE.md](PANDUAN-ONLINE.md) dan [TODO.md](TODO.md) (gitignored).

Enam pilar yang masuk roadmap ini: **SEO, ads, update konten, 3 bahasa (ID/EN/ZH), tracking kunjungan, direct WhatsApp.** Situs statis dibekukan (perbaikan kritis saja); semua pilar dibangun di WordPress.

## Keputusan arsitektur (final)

- **Stack: WordPress + Nginx + MariaDB + PHP 8.1 di STB Armbian via aaPanel.** Theme ringan (GeneratePress / Astra) + Gutenberg saja. Tanpa page builder berat, tanpa CRUD custom.
- **3 bahasa sejak migrasi via Polylang:** ID (default, `/...`), EN (`/en/...`), ZH (`/zh/...`). Bahasa master = ID; EN + ZH ≤ 7 hari setelah ID terbit.
- **Plugin minimal (jangan tambah tanpa alasan):** Polylang, RankMath (SEO + sitemap + schema + GA4), UpdraftPlus (backup ke Drive), Redirection (301), Disable XML-RPC + Limit Login / 2FA.
- **Dilarang di STB:** Elementor/Divi, slider animasi, plugin auto-translate (GTranslate dkk — merusak kualitas + SEO), plugin statistik/backup ganda. STB kentang + plugin rakus = situs lemot.
- **Font wajib dukung CJK** (fallback `Noto Sans SC`, system font). Slug ZH pakai latin sama seperti ID (jangan karakter Mandarin di URL).
- **GitHub Pages lama tetap hidup sebagai fallback** sampai WordPress stabil 30 hari.

## Fase 0 — Infra STB (pemilik: dev, ±1 hari)

- [ ] Cek spek STB (nyaman: RAM 4 GB, DB di SSD/USB3 — JANGAN di SD card), cek ISP: IP publik atau CGNAT?
- [ ] Install Armbian + aaPanel, stack LNMP (Nginx, MariaDB 10.x, PHP 8.1 + opcache)
- [ ] Domain: CGNAT → Cloudflare Tunnel (`cloudflared`); IP publik → A record + port forward 80/443. Staging dulu (`baru.`), baru domain utama
- [ ] SSL Let's Encrypt auto-renew; firewall aaPanel + fail2ban; UPS mini + pendingin
- [ ] Selesai bila: staging sudah HTTPS dari internet

## Fase 1 — WordPress + migrasi 3 bahasa (pemilik: dev, ±3-4 hari)

- [ ] Install WP (1 site, 1 DB). Permalink: Posts `/%category%/%postname%/`, Pages polos (`/produk/`, `/kebijakan-privasi/`)
- [ ] Polylang: ID + EN + ZH. Kategori tertaut: `artikel` (ID) ↔ `article` (EN) ↔ `文章` (ZH)
- [ ] Gelombang 1 (wajib saat launch, 3 bahasa): beranda, produk Tipe H/A, kontak, privasi, navigasi, footer, semua CTA
- [ ] Gelombang 2 (≤ 30 hari): 4 artikel versi ZH. Sumber istilah ZH dari `Buku BAE Translate (China & Indonesia).pdf`
- [ ] Gambar dikompres ulang (WebP, max 1600px), alt-text per bahasa via terjemahan media Polylang
- [ ] Redirect 301 (plugin Redirection) — WAJIB agar SEO lama tidak hangus:
  - `/pages/produk.html` → `/produk/`
  - `/artikel/*.html` → `/artikel/*/`
  - `/en/produk.html` → `/en/produk/`, `/en/article/*.html` → `/en/article/*/` (pola sama)
- [ ] Bekukan situs statis: commit terakhir + catat hash sebagai arsip fallback
- [ ] Selesai bila: language switcher jalan di semua halaman, tidak ada navigasi campur bahasa, tidak ada kotak tofu (□□) di halaman ZH, semua URL lama 301 tanpa chain

## Fase 2 — SOP editor non-teknis = "CRUD" (pemilik: dev bikin, BAE pakai, ±0,5 hari)

- [ ] Akun: 1 Admin (dev) + 1 Editor per staf (jangan akun bersama). Editor BOLEH: Posts/Pages/Media. Editor TIDAK BOLEH: theme/plugin/menu/update core
- [ ] `wp-config.php`: `DISALLOW_FILE_EDIT true`; update minor otomatis ON, mayor/plugin manual terjadwal
- [ ] Alur 3 bahasa: tulis ID → Save Draft → duplikat via Polylang ke EN + ZH → isi terjemahan → Admin review → Publish. Aturan: pasangan EN/ZH terbit ≤ 7 hari setelah ID
- [ ] SOP 1 halaman (PDF/tempel): judul < 60 karakter, 1 featured image + alt-text, link WA dari tombol pola (jangan ketik manual), paste dari Word sebagai plain text, slug latin saja
- [ ] Training 1 jam + 1 artikel latihan (draft): editor wajib praktik duplikat ID→EN→ZH
- [ ] Selesai bila: editor menerbitkan 1 artikel latihan 3 bahasa TANPA bantuan dev

## Fase 3 — SEO 3 bahasa (pemilik: dev, ±0,5 hari, setelah Fase 1)

- [ ] RankMath + Polylang: judul/deskripsi per bahasa, sitemap per bahasa otomatis, hreflang ID/EN/ZH otomatis, OG locale (`id_ID`, `en_US`, `zh_CN`), schema Article/FAQ/Product
- [ ] Pemetaan kata kunci awal (contoh, kembangkan dari data GSC nanti):
  - ID: kandang ayam otomatis, kandang ayam petelur, kandang tipe H
  - EN: automatic chicken cage, layer cage, type H cage
  - ZH: menunda riset keyword sampai ada trafik ZH (terjemahkan halaman dulu, optimasi menyusul)
- [ ] Search Console: submit `/sitemap_index.xml`, minta index ulang URL utama, monitor Coverage 7 hari per direktori bahasa (`/`, `/en/`, `/zh/`)
- [ ] Selesai bila: sitemap Success, URL baru terindex, URL `.html` lama hilang dari hasil, tidak ada hreflang error

## Fase 4 — Tracking kunjungan (pemilik: dev, ±2 jam, setelah Fase 1)

- [ ] GA4 via RankMath SAJA (jangan dobel Site Kit). Event (3, tidak lebih):
  - `whatsapp_click` + parameter `page_location`, `lang` (dari `<html lang>`), `cta_position` (float/header/artikel)
  - `view_produk` (halaman produk dibuka)
  - `article_scroll_75` (pembaca sampai 75% artikel)
- [ ] Cloudflare Analytics tetap jalan sebagai pembanding (tanpa cookie)
- [ ] Update halaman privasi 3 bahasa via Polylang: nyatakan GA4 aktif + data yang dikumpulkan; hapus kalimat "GA4 belum aktif" warisan situs statis
- [ ] Selesai bila: Realtime GA4 mencatat kunjungan + `whatsapp_click` dari 2 halaman beda bahasa

Tanpa fase ini, ads = bakar uang tanpa tahu konversi.

## Fase 5 — Direct WhatsApp 3 bahasa (pemilik: BAE + dev, paralel Fase 4)

Web (dev, sekali seting sebagai Reusable Block per bahasa):

- [ ] Tombol mengambang language-aware (mengikuti bahasa halaman aktif) + blok CTA akhir artikel
- [ ] Teks pra-isi per bahasa:
  - ID: `Halo BAE, saya dari [Judul Halaman], ingin tanya tentang [Topik]. Populasi: ... Lahan: ...`
  - EN: `Hello BAE, I'm viewing [Page Title], asking about [Topic]. Flock size: ... House size: ...`
  - ZH: `你好BAE，我在看[页面标题]，想咨询[主题]。存栏：... 场地：...`
- [ ] Semua `wa.me` terukur event Fase 4. Jangan tambah tombol baru

Non-web (BAE, dampak lebih besar dari kode):

- [ ] Profil WhatsApp Business + katalog (ID/EN dulu, ZH menyusul) + jam operasional
- [ ] Balasan cepat 3 bahasa: (1) minta populasi/lahan/tipe, (2) kirim brosur, (3) jadwal survei
- [ ] Selesai bila: tiap chat masuk ketahuan asal halaman + bahasanya, balasan < 5 menit jam kerja

## Fase 6 — Update konten rutin 3 bahasa (pemilik: BAE, dev review)

Tutup lubang lama dulu ([TODO.md](TODO.md) masih menagih dari klien):

- [ ] Kapasitas per set (ekor) + ukuran P x L x T; kapasitas feeding/watering/egg/manure per set; alamat + email footer; URL FB/TikTok exact; foto event

Rutinitas (1 topik/bulan → ID terbit → EN + ZH ≤ 7 hari):

- [ ] Sumber: `Buku BAE Translate` + `Materi website.pdf`. Pola terbukti: harga, perbandingan, tips operasional
- [ ] Jenis konten: artikel panduan, update produk/portofolio proyek, liputan event. Refresh artikel tiap 6 bulan. Sitemap/hreflang otomatis — tidak ada edit manual lagi
- [ ] Selesai bila: tidak ada klaim kapasitas tanpa angka, tidak ada artikel ID yang pasangan EN/ZH-nya telat > 7 hari

## Fase 7 — Ads, uji kecil (setelah Fase 4 + 5 beres, pemilik: BAE)

- [ ] Google Search dulu, ID + EN (ZH ditunda — volume cari Mandarin di Indonesia kecil). Contoh: kandang ayam otomatis / automatic chicken cage + turunan tipe H
- [ ] 1 kampanye → 1 halaman arahan SEBAHASA (`/produk/` atau `/en/produk/` + UTM `?utm_source=google&utm_medium=cpc&utm_campaign=tipe-h-id`)
- [ ] Konversi = chat WA qualified (ada populasi/lahan/tipe), BUKAN klik
- [ ] Kriteria bunuh: 2-4 minggu tanpa chat qualified → pause, alihkan ke portofolio YouTube/TikTok/IG (gratis)
- [ ] Selesai bila: tahu biaya per chat qualified dari 1 kampanye uji

## Fase 8 — Go-live + stabilisasi 30 hari (pemilik: dev)

- [ ] Pre-go-live: tes restore backup 1x, verifikasi semua 301, UptimeRobot aktif (alert WA/email), catat baseline GSC + GA4
- [ ] Pointing domain ke STB (atau Tunnel) → pantau minggu 1 harian, minggu 2-4 mingguan (uptime, suhu/disk STB, error 404, indexasi /zh/)
- [ ] Matikan GitHub Pages HANYA setelah 30 hari stabil
- [ ] Selesai bila: uptime ≥ 99%, tidak ada 404 dari URL lama, URL 3 bahasa terindex

## Operasional STB (jadwal tetap, pemilik: dev)

- [ ] Backup 2 lapis: aaPanel harian (retensi 7) + UpdraftPlus ke Drive mingguan (retensi 4)
- [ ] Update bulanan jam sepi: backup dulu baru update, cek language switcher + formulir WA setelah update, log tiap update
- [ ] Keamanan: 2FA admin, XML-RPC mati, komentar mati (company profile tidak butuh komentar)
- [ ] Monitoring: UptimeRobot + cek suhu/disk bulanan

## Urutan + dependensi

```
F0 Infra ──→ F1 WP 3 bahasa ──→ F3 SEO ──→ F4 Tracking ──→ F5 WA ──→ F7 Ads (uji ID/EN)
                    │               │
                    ├→ F2 SOP editor ┘
                    └→ F6 Konten rutin (mulai setelah F2 lulus, ID→EN→ZH ≤7 hari)
F8 Go-live setelah F1-F5 hijau; fallback Pages hidup sampai F8 selesai
```

## Metrik per pilar (cek bulanan)

| Pilar | Metrik |
|---|---|
| SEO | Halaman terindex per bahasa, klik organik, query teratas, error hreflang/404 |
| Ads | Biaya per chat qualified, bahasa/kampanye pemenang |
| Konten | Topik terbit (ID/EN/ZH tepat waktu?), artikel direfresh, lubang TODO.md tertutup |
| Bahasa | % halaman punya pasangan 3 bahasa, halaman ZH terindex |
| Tracking | Event WA/produk/scroll tercatat, privasi 3 bahasa sinkron dengan fakta |
| WhatsApp | Chat masuk, chat qualified, closing, waktu balasan |
| Operasional | Uptime STB, umur backup terakhir, status update plugin |
