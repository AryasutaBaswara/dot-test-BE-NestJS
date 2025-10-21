# Simple Blog API (NestJS Version)

## Cara Menjalankan Proyek

1.  **Clone repository ini:**

    ```bash
    git clone https://github.com/AryasutaBaswara/dot-test-BE-NestJS.git
    cd simple-blog-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Setup Database PostgreSQL:**
    - Pastikan server PostgreSQL kamu berjalan.
    - Buat database baru.
    - Jalankan query SQL di bawah ini untuk membuat tabel-tabel yang dibutuhkan:

      ```sql
      -- Membuat tabel untuk Users
      CREATE TABLE "User" (
          "id" SERIAL PRIMARY KEY,
          "email" VARCHAR(255) UNIQUE NOT NULL,
          "password" VARCHAR(255) NOT NULL,
          "name" VARCHAR(255)
      );

      -- Membuat tabel untuk Posts
      CREATE TABLE "Post" (
          "id" SERIAL PRIMARY KEY,
          "title" VARCHAR(255) NOT NULL,
          "content" TEXT,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "authorId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE
      );

      -- Membuat tabel untuk Comments
      CREATE TABLE "Comment" (
          "id" SERIAL PRIMARY KEY,
          "text" TEXT NOT NULL,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "authorId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          "postId" INTEGER NOT NULL REFERENCES "Post"(id) ON DELETE CASCADE
      );

      -- Membuat tabel untuk PostLikes
      CREATE TABLE "PostLikes" (
          "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          "postId" INTEGER NOT NULL REFERENCES "Post"(id) ON DELETE CASCADE,
          PRIMARY KEY ("userId", "postId")
      );
      ```

4.  **Setup Environment Variables:**
    - Buat file baru bernama `.env` di folder utama proyek.
    - Salin isi dari file `.env.example` (jika ada) atau isi manual seperti contoh di bawah:

      ```env
      # Konfigurasi Database
      DB_HOST=localhost
      DB_PORT=5432
      DB_USER=postgres        # Sesuaikan dengan User DB mu
      DB_PASSWORD=            # Sesuaikan dengan pwd DB mu
      DB_NAME=                # Sesuaikan dengan nama DB mu

      # Kunci Rahasia JWT
      JWT_SECRET=[bebas_random]
      ```

5.  **Jalankan Aplikasi (Mode Development):**
    ```bash
    npm run start:dev
    ```
    Server akan berjalan di `http://localhost:3000` (atau port lain jika di custom sendiri di `.env`).

---

## Arsitektur & Pola Desain (Pattern Project)

Proyek ini dibangun menggunakan **arsitektur modular** yang umum digunakan dalam NestJS, dengan mengikuti pola **Layered Architecture**. Setiap fitur utama (seperti `User`, `Post`, `Comment`, `Auth`) dipisahkan ke dalam modulnya sendiri (`*.module.ts`).

Di dalam setiap modul fitur, kodenya dibagi lagi menjadi beberapa lapisan (layer):

1.  **Controller (`*.controller.ts`)**: Lapisan terluar yang bertanggung jawab menerima _request_ HTTP dan mengirimkan _response_. Lapisan ini bertindak sebagai perantara dan memanggil _Service_.
2.  **Service (`*.service.ts`)**: Lapisan ini berisi semua **logika bisnis** aplikasi. Ia memproses data, melakukan validasi, dan berkoordinasi dengan _Repository_ untuk mengakses database.
3.  **Repository (`*.repository.ts`)**: Lapisan yang **bertanggung jawab penuh** untuk berkomunikasi dengan database (menjalankan query SQL). Lapisan ini memisahkan logika akses data dari logika bisnis.
4.  **DTO (`dto/*.dto.ts`)**: _Data Transfer Object_ digunakan untuk mendefinisikan bentuk data yang masuk (_request body_) dengan jelas, memastikan validasi dan _type safety_.
5.  **Entity (`*.entity.ts`)**: Mendefinisikan struktur data atau bentuk tabel di database untuk digunakan oleh TypeScript.

### Alasan Pemilihan Pattern

Saya memilih **arsitektur modular** dengan **Layered Architecture (Controller-Service-Repository)** karena:

- **Pemisahan Tanggung Jawab (Separation of Concerns)**: Setiap lapisan memiliki fokus yang jelas, membuat kode lebih terstruktur, mudah dibaca, dan dipahami.
- **Mudah Dikelola (Maintainability)**: Perubahan pada satu lapisan (misalnya, mengganti query database di Repository) memiliki dampak minimal pada lapisan lain. Ini memudahkan perawatan dan pengembangan jangka panjang.
- **Mudah Dites (Testability)**: Dengan memisahkan logika bisnis (Service) dari akses data (Repository) dan presentasi (Controller), setiap bagian dapat diuji secara terpisah (_unit testing_) dengan lebih mudah.
- **Standar NestJS**: Ini adalah pola arsitektur yang direkomendasikan dan didukung penuh oleh NestJS, memanfaatkan fitur _Dependency Injection_ untuk menghubungkan antar lapisan secara efisien.

---

## Dokumentasi API (Postman)

Dokumentasi detail _endpoint_ API, _request body_, dan contoh _response_ dapat ditemukan di file koleksi Postman yang disertakan dalam repository ini: `Dot_test.postman_simple-blog.json`. Anda dapat mengimpor file ini ke aplikasi Postman Anda.

---

## Testing

Proyek ini dilengkapi dengan tes End-to-End (E2E) menggunakan Jest dan Supertest. Untuk menjalankan tes:

1.  Pastikan aplikasi tidak sedang berjalan.
2.  Pastikan konfigurasi database di `.env` sudah benar dan database tes (bisa sama dengan database development) dapat diakses.
3.  Kompilasi kode TypeScript:
    ```bash
    npm run build
    ```
4.  Jalankan skrip tes E2E:
    ```bash
    npm run test:e2e
    ```
