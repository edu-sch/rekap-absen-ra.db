# 🏫 Sistem Informasi Akademik, Presensi & SPP - RA Darul Barokah Surabaya

Aplikasi web resmi untuk rekapitulasi presensi siswa dan pencatatan pembayaran SPP bulanan di RA Darul Barokah Surabaya.

## 🌟 Fitur Terbaru
1. **Logo Resmi Lembaga**: Menggunakan logo resmi RA Darul Barokah (`logo.png`) pada header navigasi, lembar cetak rekapitulasi, dan kwitansi.
2. **Desain Profesional & Ramping**:
   - Menu dan banner yang tidak perlu telah dibersihkan.
   - Antarmuka rapi, bersih, dan fokus pada data.
3. **Tanda Tangan Tunggal Kepala RA**:
   - Lembar rekapitulasi presensi dan kwitansi kini hanya mencantumkan tanda tangan resmi **Kepala RA Darul Barokah (NURUL MUSYARROFAH)**.
   - **Stempel digital telah dihilangkan**, menyisakan ruang tanda tangan resmi yang bersih untuk cap fisik/basah jika diperlukan.
4. **Cetak Kwitansi Selektif (Checkbox Batch Printing)**:
   - Terdapat kotak centang (checkbox) di samping setiap nama murid.
   - Anda dapat mencentang hanya murid-murid tertentu yang ingin dicetak kwitansinya.
   - Tombol **"Cetak Kwitansi Terpilih"** di header akan menampilkan jumlah murid yang dicentang dan mencetak kwitansi mereka sekaligus (masing-masing otomatis pisah halaman saat dicetak).
   - Murid yang tidak dicentang tidak akan ikut tercetak.
5. **Real-Time Cloud Sync ke Google Sheets**:
   - Setiap penambahan murid atau pengeditan data rekap otomatis langsung terkirim ke Google Spreadsheet di Google Drive.
   - Mendukung pemilihan periode bulan (Agustus 2026 dan seterusnya).

---

## 📁 Berkas Proyek
- `index.html` : Aplikasi web utama.
- `logo.png` : Berkas logo resmi RA Darul Barokah.
- `google-apps-script.js` : Kode backend Google Apps Script.
- `README.md` : Dokumentasi sistem.

---

## 🚀 Cara Upload ke GitHub
1. Buat repositori baru di [GitHub](https://github.com/new) bernama `spp-darul-barokah`.
2. Klik **"uploading an existing file"**.
3. Seret file `index.html`, `logo.png`, `google-apps-script.js`, dan `README.md` ke GitHub.
4. Klik **Commit changes**.
5. Buka tab **Settings** > **Pages** > pilih branch `main` lalu **Save** untuk mengaktifkan website online gratis.
