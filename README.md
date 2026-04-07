# Social Performance Monitor

Web application berbasis Next.js untuk memantau performa 3 platform sosial media dalam satu dashboard:

- YouTube
- TikTok
- Instagram

Aplikasi ini menampilkan nama akun, foto profil, total views, serta daftar konten terbaru dari masing-masing platform dalam tampilan yang ringkas dan mudah dibandingkan.

## Tech Stack

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- RapidAPI
- YouTube Data API v3

## Menjalankan Project

Install dependency:

```bash
npm install
```

Buat file `.env.local` lalu isi environment variable berikut:

```env
YOUTUBE_API_KEY=your_youtube_api_key
RAPIDAPI_KEY=your_rapidapi_key
```

Jalankan project:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Penjelasan Singkat

### Pendekatan yang Digunakan

Project ini dibangun menggunakan Next.js dengan pendekatan server-side data fetching melalui API route internal. Setiap platform memiliki layer integrasi sendiri agar proses pengambilan data tetap terpisah, lebih rapi, dan mudah diganti apabila di kemudian hari perlu berpindah ke provider atau API resmi yang berbeda.

Data dari YouTube, TikTok, dan Instagram dinormalisasi ke dalam satu bentuk data yang konsisten sebelum dikirim ke frontend. Dengan pendekatan ini, komponen UI tidak perlu mengetahui perbedaan struktur response dari masing-masing platform, sehingga dashboard bisa menampilkan data secara seragam dan lebih mudah dikembangkan.

Untuk kebutuhan refresh data tanpa reload halaman, aplikasi menggunakan pemanggilan endpoint per platform secara dinamis dari sisi client. Dengan begitu, setiap platform dapat diperbarui secara independen tanpa memengaruhi data platform lain.

### Kendala yang Ditemui dan Solusi yang Diterapkan

1. Integrasi Instagram

Kendala terbesar ada pada proses mencari provider API Instagram yang sesuai. Beberapa API memang dapat mengembalikan data yang cukup lengkap, tetapi aksesnya dibatasi quota atau mengharuskan penggunaan plan berbayar. Di sisi lain, beberapa opsi gratis bisa digunakan untuk mengambil profil dan postingan, tetapi field yang dibutuhkan tidak selalu lengkap, terutama untuk data views per konten maupun total views.

Solusi yang diterapkan adalah menggunakan pendekatan yang fleksibel terhadap provider Instagram. Struktur integrasi dibuat terpisah agar mudah menyesuaikan endpoint dan mapping data sesuai provider yang tersedia, sehingga aplikasi tetap bisa berjalan meskipun ada keterbatasan pada sumber data.

2. Perhitungan Total Views TikTok

Pada TikTok, provider yang digunakan tidak menyediakan nilai total keseluruhan views akun secara langsung dalam satu field. Karena itu, total views tidak bisa diambil secara instan dari data profil.

Solusi yang diterapkan adalah mengambil seluruh konten yang berhasil diakses melalui pagination, lalu menjumlahkan views dari masing-masing konten secara manual. Pendekatan ini digunakan agar total views yang ditampilkan tetap merepresentasikan akumulasi views akun berdasarkan data yang berhasil diperoleh dari provider.

3. Waktu Loading TikTok dan Instagram

Waktu loading TikTok cenderung lebih lama dibanding YouTube karena proses perhitungan total views dilakukan secara manual. Untuk mendapatkan total views akun, sistem perlu mengambil data konten secara bertahap melalui beberapa request pagination, kemudian menjumlahkan seluruh views dari konten yang berhasil diperoleh.

Pada Instagram, waktu loading juga lebih tinggi karena proses integrasinya lebih kompleks. Sistem perlu mencoba provider utama terlebih dahulu, lalu menggunakan fallback ke provider lain apabila data konten dari provider utama tidak lengkap atau tidak dapat dipakai. Selain itu, data postingan juga diambil secara bertahap melalui beberapa request, sehingga total waktu respons menjadi lebih panjang dibanding platform lain.

## Catatan

- Akurasi data sangat bergantung pada availability dan kelengkapan field dari provider API masing-masing platform.
- Untuk Instagram dan TikTok, beberapa field dapat berbeda tergantung akun, jenis konten, dan batasan provider yang digunakan.
- Seluruh secret disimpan melalui environment variable dan tidak diletakkan di source code frontend.
