# CoffeeFlow - Website Manajemen Coffee Shop

Project ini dibuat untuk tugas database PostgreSQL + backend API + frontend CRUD.
Tema aplikasi: **Manajemen Coffee Shop**.

Aplikasi berjalan di localhost:

```bash
http://localhost:3000
```

## 1. Fitur Aplikasi

Fitur utama:

1. CRUD Menu
   - Tambah menu coffee shop.
   - Lihat daftar menu.
   - Ubah data menu.
   - Hapus menu.

2. CRUD Pelanggan
   - Tambah pelanggan.
   - Lihat pelanggan.
   - Ubah data pelanggan.
   - Hapus pelanggan.

3. CRUD Pesanan
   - Buat pesanan.
   - Lihat daftar pesanan.
   - Lihat detail pesanan.
   - Hapus pesanan.

4. Endpoint Redirect
   - `GET /api/redirect/google`
   - Redirect ke Google Search.

## 2. Entitas Database

Database memiliki 7 tabel:

1. `categories`
2. `menu_items`
3. `customers`
4. `employees`
5. `orders`
6. `order_details`
7. `payments`

## 3. Relasi Database

Relasi utama:

- `categories` 1 ke banyak `menu_items`
- `customers` 1 ke banyak `orders`
- `employees` 1 ke banyak `orders`
- `orders` 1 ke banyak `order_details`
- `menu_items` 1 ke banyak `order_details`
- `orders` 1 ke 1 `payments`

## 4. Primary Key dan Foreign Key

Primary Key:

- `categories.category_id`
- `menu_items.menu_id`
- `customers.customer_id`
- `employees.employee_id`
- `orders.order_id`
- `order_details.order_detail_id`
- `payments.payment_id`

Foreign Key:

- `menu_items.category_id` → `categories.category_id`
- `orders.customer_id` → `customers.customer_id`
- `orders.employee_id` → `employees.employee_id`
- `order_details.order_id` → `orders.order_id`
- `order_details.menu_id` → `menu_items.menu_id`
- `payments.order_id` → `orders.order_id`

## 5. Cara Menjalankan Database PostgreSQL

### A. Buat database di pgAdmin 4

1. Buka pgAdmin 4.
2. Klik kanan **Databases**.
3. Pilih **Create → Database**.
4. Isi nama database:

```text
coffee_shop_db
```

5. Klik **Save**.

### B. Jalankan DDL

1. Klik database `coffee_shop_db`.
2. Klik kanan → **Query Tool**.
3. Buka file:

```text
database/schema.sql
```

4. Jalankan semua script.

### C. Jalankan data contoh

Setelah `schema.sql` berhasil, jalankan:

```text
database/seed.sql
```

## 6. Cara Menjalankan Backend dan Frontend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
npm install
```

Buat file `.env` dari `.env.example`:

```bash
copy .env.example .env
```

Untuk Windows PowerShell bisa gunakan:

```powershell
Copy-Item .env.example .env
```

Edit isi `.env` sesuai password PostgreSQL kamu:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_shop_db
DB_USER=postgres
DB_PASSWORD=password_postgres_kamu
```

Jalankan server:

```bash
npm start
```

Lalu buka browser:

```text
http://localhost:3000
```

## 7. Daftar Endpoint API

### Check API

```http
GET /api
```

### Menu

```http
GET    /api/menus
POST   /api/menus
PUT    /api/menus/:id
DELETE /api/menus/:id
```

### Kategori

```http
GET /api/categories
```

### Pelanggan

```http
GET    /api/customers
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Pegawai

```http
GET /api/employees
```

### Pesanan

```http
GET    /api/orders
GET    /api/orders/:id/details
POST   /api/orders
PUT    /api/orders/:id/status
DELETE /api/orders/:id
```

### Redirect

```http
GET /api/redirect/google
GET /api/redirect/app
```

## 8. Contoh Body Request API

### Tambah Menu

```json
{
  "category_id": 1,
  "menu_name": "Iced Coffee Milk",
  "price": 23000,
  "stock": 25,
  "is_available": true
}
```

### Tambah Pelanggan

```json
{
  "customer_name": "Dewi Lestari",
  "phone": "081212121212",
  "email": "dewi@mail.com"
}
```

### Buat Pesanan

```json
{
  "customer_id": 1,
  "employee_id": 1,
  "payment_method": "QRIS",
  "items": [
    { "menu_id": 1, "quantity": 2 },
    { "menu_id": 6, "quantity": 1 }
  ]
}
```

## 9. Poin Presentasi

### A. Database

Jelaskan:

- Database menggunakan PostgreSQL.
- Pengelolaan database dilakukan melalui pgAdmin 4.
- Tabel saling terhubung menggunakan Primary Key dan Foreign Key.
- Tabel `orders` menjadi pusat transaksi.
- Tabel `order_details` menyimpan detail menu yang dibeli.
- Tabel `payments` menyimpan data pembayaran.

### B. Backend / ORM

Jelaskan:

- Backend menggunakan Node.js dan Express.js.
- Struktur backend memakai pola MVC:
  - Model untuk query database.
  - Controller untuk logika request dan response.
  - Routes untuk daftar endpoint API.
- Koneksi database menggunakan library `pg`.
- CRUD frontend terhubung ke PostgreSQL melalui API backend.

### C. Frontend

Jelaskan:

- Frontend dibuat dengan HTML, CSS, dan JavaScript.
- Frontend mengambil data dari endpoint API menggunakan `fetch()`.
- Fitur yang bisa dicoba saat demo:
  - Tambah menu baru.
  - Edit data menu.
  - Tambah pelanggan.
  - Buat pesanan.
  - Lihat detail pesanan.
  - Hapus data.

## 10. Alur Demo Cepat Saat Presentasi

1. Buka pgAdmin, tunjukkan database `coffee_shop_db`.
2. Tunjukkan tabel dan relasinya.
3. Buka file `schema.sql`, jelaskan PK dan FK.
4. Jalankan backend dengan `npm start`.
5. Buka `http://localhost:3000`.
6. Coba tambah menu.
7. Coba tambah pelanggan.
8. Coba buat pesanan.
9. Buka `http://localhost:3000/api/menus` untuk membuktikan API berjalan.
10. Buka `http://localhost:3000/api/redirect/google` untuk menunjukkan endpoint redirect.

## 11. Struktur Folder

```text
coffee_shop_management
├── backend
│   ├── package.json
│   ├── .env.example
│   └── src
│       ├── config
│       ├── controllers
│       ├── models
│       ├── routes
│       └── server.js
├── database
│   ├── schema.sql
│   └── seed.sql
├── frontend
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```
