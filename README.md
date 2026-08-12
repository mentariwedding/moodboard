# 🌸 Mentari Wedding — The Wedding Moodboard

Aplikasi moodboard untuk wedding organizer: **WO membuat proyek → dapat link unik → client mengisi sendiri dari HP → hasil tersusun rapi di dashboard WO**. Tanpa bolak-balik chat.

## Alur untuk istri (WO)

1. Buka **Dashboard** → klik **＋ Proyek Baru** → isi nama pasangan (tanggal/venue opsional) + **No. WA client**. Bisa pilih **Mode isi bareng** untuk membuat 2 link (mempelai 1 & 2).
2. Sistem membuat **link unik** untuk pasangan itu — otomatis memuat nama pasangan supaya cantik: `.../mb/salsabila-raka/a1b2c3d4` (link lama tanpa nama tetap berfungsi).
3. Klik **📲 Kirim via WA** — pesan (berisi link + kode akses) langsung terbuka ke **nomor WA client** yang sudah diisi.
4. Client buka link di HP-nya: mengisi **13 seksi** moodboard dengan klik-klik, upload foto, tempel link Pinterest/IG. Bisa disimpan sebagai draft dan dilanjut kapan saja.
5. Begitu client **Submit**, dashboard WO otomatis ter-update (real-time) → status **Selesai ✓** → lihat ringkasan rapi per kategori, foto referensi, atau data mentah (JSON).
6. WO menandai **Sudah diproses** → link client otomatis berubah jadi layar "Moodboard Sudah Diproses" (isian terkunci; revisi harus hubungi WO).

## Fitur unggulan

| Fitur | Untuk siapa | Penjelasan |
|---|---|---|
| 🎨 **Live Moodboard Canvas** | Client | Papan moodboard ala Pinterest yang **tersusun otomatis & live** dari jawaban client — tema, palet, pilihan dekor/busana, dan foto referensi. Desktop: panel sticky di kanan; HP: tombol melayang + bottom sheet |
| 💌 **Save-the-Date Card** | Client | Layar penyambutan elegan (font script + flourish) sebelum masuk form — nama pasangan, tanggal, countdown. Hanya muncul saat mulai dari nol |
| ✒️ **Script font & kelopak** | Client | Font kaligrafi *Great Vibes* untuk nama pasangan, ornamen flourish SVG, dan kelopak bunga melayang di halaman depan & halaman sukses |
| 🎞️ **Transisi animasi** | Client | Slide/fade lembut setiap pindah seksi + angka progress yang beranimasi (count-up) |
| 🖨️ **Cetak / PDF A4** | WO | Ringkasan moodboard multi-halaman siap cetak ("Save as PDF") — lampiran proposal & rapat |
| 📱 **QR Code link** | WO | Link moodboard jadi QR siap unduh/cetak — untuk undangan fisik, brosur, kartu nama |
| ✒️ **Monogram pasangan** | Client + WO | Logo melingkar elegan dari inisial nama dengan warna palet client — tampil di header wizard, kartu sukses, poster, QR, dan halaman pasangan |
| 🖼️ **Lightbox galeri** | WO | Foto referensi di dashboard bisa diklik → tampil besar, navigasi panah/geser, dukungan keyboard (Esc/←/→) |
| 💾 **Auto-save** | Client | Setiap perubahan tersimpan otomatis (~3 detik) dengan indikator "Tersimpan otomatis" — HP mati/ke-tutup pun data aman |
| 💬 **Komentar per seksi** | Client + WO | WO tanya/beri arahan di seksi tertentu, client balas langsung di aplikasi — badge di stepper & kartu dashboard, semua keputusan tercatat rapi |
| 📅 **Simpan ke Kalender (ICS)** | Client + WO | Satu klik unduh file kalender dari tanggal pernikahan (bisa dengan jam mulai) — buka di Google Calendar / kalender HP |
| 🎵 **Playlist lagu + Media Player** | Client + WO | Tempel link YouTube/Spotify → tombol **Putar** langsung di aplikasi (embed on-demand, thumbnail YouTube). Tersedia di wizard client, dashboard WO, dan halaman pasangan | Client tempel link Spotify/YouTube per momen (akad, resepsi, first dance…) — judul otomatis terisi, muncul di dashboard, print, & halaman pasangan |
| 🎨 **UI ikut palet client** | Client | Aksen wizard (tombol, progress, badge) berubah warna mengikuti palet yang dipilih client — moodboard terasa "milik mereka" |
| ✨ **Konsep otomatis** | Client + WO | Sistem merangkum semua jawaban jadi paragraf konsep yang bisa diedit client |
| 🎊 **Halaman sukses + confetti** | Client | Setelah submit: confetti + kartu ringkasan estetik yang bisa di-download jadi gambar (buat story WA) |
| 💍 **Countdown hari-H** | Client | "124 hari lagi" di header wizard |
| 💑 **Mode isi bareng pasangan** | Client + WO | 2 link terpisah (mempelai 1 & 2), jawaban digabung otomatis di dashboard, lengkap dengan progres per mempelai |
| ⏰ **Kirim Pengingat** | WO | Satu klik → pesan WA sopan + link, untuk client yang belum mengisi |
| 📝 **Catatan WO per seksi** | WO | Kolom keputusan/budget/saran di samping tiap jawaban client — dashboard jadi dokumen kerja rapat desain |
| 🖼️ **Moodboard Poster** | WO | Satu klik → poster ringkasan visual (tema, palet, prioritas, foto referensi) siap di-download untuk rapat/vendor |
| 💒 **Halaman pasangan** | WO + Client | Mini wedding website publik per pasangan (konsep + tema + palet + foto) — bisa dibagikan ke keluarga, sekaligus portfolio WO |
| 📊 **Status real-time** | WO | Dashboard live ter-update begitu client menyimpan/men-submit |

## Isi moodboard (13 seksi)

The Couple (data pasangan) · The Vibe (tema & konsep) · Color Palette (palet warna) · Décor & Flowers · The Look (busana & rias) · The Ceremony (rangkaian acara) · The Feast (makanan) · Stationery (undangan) · Captured Moments (foto & video) · Priorities (prioritas hari-H) · Never Ever (hal yang dihindari) · References (upload foto & link)

## Mode demo (tanpa setup)

Tanpa konfigurasi apa pun, aplikasi berjalan **mode demo**: data disimpan di localStorage browser, dan sudah ada proyek contoh (`Salsabila & Raka` — mode isi bareng, mempelai 1 lengkap & mempelai 2 sebagian).

- Dashboard: `/dashboard` (terkunci kode — default `1234`, ubah lewat `VITE_DEMO_PIN` di `.env`)
- Contoh isian client: `/demo` (isi mempelai 1) — tambahkan `?who=two` untuk melihat sisi mempelai 2
- Halaman pasangan contoh: `/couple/demo`

> Catatan: di mode demo, "data tersimpan di browser ini saja" — client di HP lain belum bisa ikut mengisi sampai Supabase dikonfigurasi.

## Setup Supabase (biar link bisa dipakai client sungguhan)

1. Buat proyek gratis di [supabase.com](https://supabase.com) (pilih region terdekat, mis. Singapore).
2. Buka **SQL Editor** → jalankan isi file [`supabase/schema.sql`](supabase/schema.sql) (membuat tabel, security rules, dan bucket penyimpanan foto).

   > **Satu akun Supabase untuk banyak aplikasi?** Aman — semua tabel & bucket memakai prefix `mw_` (`mw_projects`, `mw_moodboards`, `mw_references`) sehingga tidak bentrok dengan aplikasi lain di proyek yang sama. Prefix bisa diubah lewat `VITE_DB_PREFIX` di `.env` (sesuaikan juga isi schema.sql sebelum dijalankan).
3. Buka **Project Settings → API**: salin **Project URL** dan **anon public key** ke file `.env`:

   ```bash
   cp .env.example .env
   # lalu isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
   ```

4. Buat akun WO: di **Authentication → Users → Add user** (email + password), atau atur `VITE_WO_SIGNUP_CODE` di `.env` supaya bisa daftar sendiri dari halaman login dashboard.
5. Restart dev server, login di `/dashboard`, buat proyek, kirim link ke client. 🎉

**Aktifkan Realtime (biar dashboard auto-update tanpa refresh):**
Dashboard otomatis polling tiap 30 detik sebagai cadangan, tapi untuk update instan: buka Dashboard Supabase → **Database → Replication** → di bagian *Source* aktifkan toggle untuk tabel **`mw_moodboards`** → Save.

## Menjalankan

```bash
npm install
npm run dev       # development (http://localhost:5173)
npm run build     # build produksi ke dist/
```

## Keamanan

- **Client tidak perlu akun**: keamanan berbasis token — token ada di URL (seperti magic link) dan dipakai sebagai header `x-project-token` untuk aturan RLS di Supabase.
- **Dashboard WO** dilindungi login email (Supabase Auth) — hanya yang login bisa melihat data client.
- Foto referensi client hanya bisa diunggah/dibaca lewat folder token masing-masing (aturan storage).

## Debugging

Aplikasi punya sistem log & panel debug bawaan:

- **Buka panel debug**: tekan `Ctrl+Shift+D` (Windows/Linux) atau `Cmd+Shift+D` (Mac) — atau tambahkan `?debug=1` di URL.
- Panel menampilkan log terbaru (info/warn/error) dengan timestamp, ada tombol **Bersihkan** & **Tutup**.
- Semua log juga tersimpan di `localStorage` (maks 200 entri) — bisa diperiksa lewat DevTools → Application → Local Storage → `mw_debug_logs`.
- Error global yang tidak tertangkap (uncaught exception / unhandled rejection) otomatis tercatat.
- Di mode produksi, `console.log` ditekan (hanya warn/error yang tampil); log tetap tercatat di panel & localStorage.

Cara pakai untuk melapor bug: buka panel debug → reproduksi masalah → salin isi panel (atau `mw_debug_logs`) → kirim ke pengembang.
