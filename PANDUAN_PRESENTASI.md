# Naskah Singkat Presentasi CoffeeFlow

## Pembukaan

Assalamualaikum warahmatullahi wabarakatuh.
Pada tugas ini saya membuat aplikasi berbasis website dengan tema manajemen coffee shop. Nama aplikasinya adalah CoffeeFlow. Aplikasi ini dibuat untuk membantu pengelolaan menu, pelanggan, dan pesanan pada sebuah coffee shop.

## A. Database

Database yang digunakan adalah PostgreSQL dan pengelolaannya menggunakan pgAdmin 4. Di dalam database terdapat beberapa tabel, yaitu categories, menu_items, customers, employees, orders, order_details, dan payments.

Setiap tabel memiliki Primary Key sebagai identitas utama. Contohnya, tabel menu_items memiliki menu_id sebagai Primary Key. Untuk menghubungkan antar tabel digunakan Foreign Key. Contohnya, menu_items memiliki category_id yang terhubung ke tabel categories. Lalu orders memiliki customer_id dan employee_id yang terhubung ke tabel customers dan employees.

Relasi utamanya adalah orders sebagai tabel transaksi. Satu order bisa memiliki banyak detail pesanan di tabel order_details. Setiap detail pesanan terhubung dengan menu yang ada di tabel menu_items. Setelah order dibuat, data pembayaran akan masuk ke tabel payments.

## B. Backend / API

Backend dibuat menggunakan Node.js dan Express.js. Struktur backend menggunakan pola MVC, yaitu Model, View, dan Controller. Model digunakan untuk query ke database PostgreSQL, Controller digunakan untuk mengatur proses request dan response, sedangkan Routes digunakan untuk menentukan alamat endpoint API.

Contoh endpoint yang dibuat adalah GET /api/menus untuk melihat data menu, POST /api/menus untuk menambah menu, PUT /api/menus/:id untuk mengubah menu, dan DELETE /api/menus/:id untuk menghapus menu.

Selain itu, aplikasi ini juga memiliki endpoint redirect, yaitu /api/redirect/google. Jika endpoint tersebut dibuka, maka browser akan diarahkan ke Google sesuai arahan dosen.

## C. Frontend

Frontend dibuat menggunakan HTML, CSS, dan JavaScript. Tampilan frontend dibuat seperti dashboard sederhana agar pengguna bisa melihat data menu, pelanggan, dan pesanan.

Frontend mengambil data dari backend menggunakan fetch API. Jadi ketika pengguna menambah, mengubah, atau menghapus data di tampilan website, data tersebut akan dikirim ke backend, lalu backend akan menyimpan perubahan tersebut ke PostgreSQL.

## Demo CRUD

Untuk demo, saya bisa menunjukkan fitur tambah menu, edit menu, tambah pelanggan, lalu membuat pesanan. Setelah pesanan dibuat, stok menu akan berkurang secara otomatis dan data order akan masuk ke database.

## Penutup

Kesimpulannya, aplikasi CoffeeFlow sudah memenuhi kebutuhan tugas karena sudah memiliki database PostgreSQL, DDL dengan Primary Key dan Foreign Key, backend yang terhubung ke database, API endpoint, CRUD, frontend, dan endpoint redirect ke Google.

Terima kasih.
Wassalamualaikum warahmatullahi wabarakatuh.
