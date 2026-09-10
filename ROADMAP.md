# ROADMAP Website BAE — 6 konsep

Status awal 2026-09-10: SEO fondasi jadi (canonical, hreflang ID/EN, sitemap, OG, JSON-LD), Cloudflare Analytics aktif, tombol WA di semua halaman, artikel 4 ID + 4 EN + indeks, halaman privasi ID + EN. Lihat [PANDUAN-ONLINE.md](PANDUAN-ONLINE.md) dan [TODO.md](TODO.md).

Prinsip: Search Console + tracking dulu (murah, prasyarat semua), konten rutin, ads terakhir, Mandarin versi ringan saja.

## Fase 0 — SEO dasar (Minggu 1, ±1 jam, pemilik: dev)

- [ ] Daftar Search Console → properti URL `https://poultry-equipment.biz.id/` → verifikasi tag HTML → commit + push → Verify
- [ ] Sitemaps → Add sitemap → isi `sitemap.xml` → Submit
- [ ] Cek 7 hari kemudian: Pages terindex, ketik `site:poultry-equipment.biz.id` di Google
- [ ] Selesai bila: sitemap status Success, halaman utama terindex

Catatan: jangan optimasi lanjutan sebelum ada data query riil dari Search Console.

## Fase 1 — Tracking kunjungan (Minggu 1-2, ±2 jam, pemilik: dev)

- [ ] Buat properti GA4 → copy Measurement ID (`G-...`)
- [ ] Pasang snippet GA4 di SEMUA file HTML (saat ini template komentar GA4 hanya ada di `index.html` + `pages/produk.html` — perluas ke artikel, indeks artikel, privasi, halaman EN)
- [ ] Tambah 2 event: klik WhatsApp (`whatsapp_click` + `page_location`), view halaman produk
- [ ] Update [kebijakan-privasi.html](kebijakan-privasi.html) + versi EN: hapus kalimat "GA4 belum aktif", tulis data apa yang GA4 kumpulkan
- [ ] Selesai bila: Realtime GA4 mencatat kunjungan + klik WA dari 2 halaman berbeda

Tanpa fase ini, ads = bakar uang tanpa tahu konversi.

## Fase 2 — Direct WhatsApp (Minggu 2, ±2 jam web + kerja non-web, pemilik: BAE + dev)

Web (dev):

- [ ] Bedakan `text=` pra-isi per halaman, format: `Halo BAE, saya dari [Nama Halaman], ingin tanya tentang [Topik]`
  - Contoh: Beranda → Tipe H vs Tipe A; artikel harga → minta penawaran + populasi; produk → tipe spesifik
- [ ] Pastikan setiap `wa.me` punya event `whatsapp_click` dari Fase 1

Non-web (BAE, dampak lebih besar dari kode):

- [ ] Profil WhatsApp Business lengkap + katalog + jam operasional
- [ ] 3 balasan cepat: minta populasi/ukuran lahan/tipe; kirim brosur; jadwal survei
- [ ] Selesai bila: tiap chat masuk ketahuan asalnya (teks pra-isi), balasan < 5 menit jam kerja

Jangan tambah tombol baru — tombol mengambang + header + seksi kontak + CTA artikel sudah cukup.

## Fase 3 — Update konten (rutin, pemilik: BAE kasih data, dev terbitkan)

Tutup lubang lama dulu ([TODO.md](TODO.md) masih menagih dari klien):

- [ ] Kapasitas feeding/watering/egg/controller/manure per set (materi hanya "-")
- [ ] Kapasitas per set (ekor) + ukuran P x L x T
- [ ] Alamat perusahaan + email untuk footer
- [ ] URL Facebook + TikTok exact (materi hanya nama/handle)
- [ ] Foto event yang sudah diikuti

Rutinitas (1 artikel/bulan, selalu ID + EN, pola yang terbukti: harga, perbandingan, tips):

- [ ] Gali dari `Buku BAE Translate` + `Materi website.pdf` (feeding, manure, silo, ventilasi, cooling pad)
- [ ] Tiap artikel baru: daftarkan di `sitemap.xml`, tautkan dari `artikel/index.html` + versi EN, pasang canonical + hreflang + beacon
- [ ] Refresh artikel lama tiap 6 bulan (angka, foto) + update `lastmod`
- [ ] Selesai bila: tidak ada halaman "kosong" (semua klaim kapasitas ada angkanya)

## Fase 4 — Ads, uji kecil saja (setelah Fase 1 + 2 beres, pemilik: BAE)

Syarat jalan: GA4 + event WA hidup, privasi diperbarui, balasan WA cepat.

- [ ] Mulai dari Google Search (kata: kandang ayam otomatis, kandang ayam petelur, kandang tipe H) — niche B2B tiket besar, closing via chat
- [ ] Satu halaman arahan per kampanye (`pages/produk.html` + UTM), jangan sebar ke beranda
- [ ] Konversi = chat WA qualified (ada info populasi/lahan/tipe), BUKAN klik
- [ ] Kriteria bunuh: 2-4 minggu tanpa chat qualified → pause, alihkan ke portofolio YouTube/TikTok/IG (gratis, disebut di beranda)
- [ ] Selesai bila: tahu biaya per chat qualified dari 1 kampanye uji

## Fase 5 — Mandarin, versi ringan (ditunda sampai ada bukti permintaan)

Keputusan: JANGAN mirror penuh `zh/` sekarang. Alasan: tiap edit jadi 3x kerja selamanya, GitHub Pages lambat dari Tiongkok daratan, Baidu tidak mengindeksnya dengan baik.

- [ ] Buat SATU halaman ringkas `zh/index.html` (profil, 2 tipe kandang, CTA WA) + tautan PDF profil Mandarin dari buku terjemahan yang sudah ada
- [ ] Tambah `hreflang="zh"` + entri sitemap untuk halaman itu saja
- [ ] Pemicu mirror penuh: trafik ZH nyata di GA4 ATAU permintaan buyer Mandarin berulang
- [ ] Selesai bila: ada 1 URL Mandarin yang bisa dikirim ke calon buyer

## Urutan + dependensi

```
F0 SEO dasar ──→ F1 Tracking ──→ F2 WA ──→ F4 Ads (uji)
                      │               │
                      └→ F5 ZH ringan (kapan saja, 1 halaman)
F3 Konten: jalan paralel terus, tapi butuh data klien dari TODO.md
```

## Metrik (cek bulanan)

- Search Console: halaman terindex, klik organik, query teratas
- GA4: pengunjung, sumber (WA/IG/search), klik WA per halaman
- WA: chat masuk, chat qualified (ada populasi/lahan/tipe), closing
- Konten: artikel terbit ID+EN, artikel direfresh
