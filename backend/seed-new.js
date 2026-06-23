const pool = require('./src/config/db');

async function seed() {
  try {
    await pool.query('BEGIN');
    
    // Clear existing data (optional but good for repeatable seeds)
    await pool.query('DELETE FROM tb_order_detail');
    await pool.query('DELETE FROM tb_order');
    await pool.query('DELETE FROM tb_product_ing');
    await pool.query('DELETE FROM tb_product');
    await pool.query('DELETE FROM tb_meja');
    await pool.query('DELETE FROM tb_ing');
    await pool.query('DELETE FROM tb_customer');
    await pool.query('DELETE FROM tb_barista');

    console.log('Inserting Baristas...');
    await pool.query(`INSERT INTO tb_barista (barista_id, barista_name, shift, phone_number) VALUES
      (1, 'Axell Ramadhani', 'Pagi', '081111111111'),
      (2, 'Nadia Putri', 'Siang', '082222222222')`);

    console.log('Inserting Customers...');
    await pool.query(`INSERT INTO tb_customer (customer_id, customer_name, email, phone, points) VALUES
      (1, 'Budi Santoso', 'budi@mail.com', '081234567890', 0),
      (2, 'Siti Aisyah', 'siti@mail.com', '082233445566', 10)`);

    console.log('Inserting Ingredients...');
    await pool.query(`INSERT INTO tb_ing (ing_id, ing_name, stock_qty, unit) VALUES
      (1, 'Biji Kopi Arabica', 5000, 'gram'),
      (2, 'Susu Segar', 10000, 'ml'),
      (3, 'Gula Aren', 2000, 'gram')`);

    console.log('Inserting Meja...');
    await pool.query(`INSERT INTO tb_meja (meja_id, nomor_meja, kapasitas, status) VALUES
      (1, 1, 2, 'Available'),
      (2, 2, 4, 'Occupied'),
      (3, 3, 4, 'Available')`);

    console.log('Inserting Products...');
    await pool.query(`INSERT INTO tb_product (product_id, product_name, category, price, description) VALUES
      ('P001', 'Americano', 'Coffee', 18000, 'Espresso dengan tambahan air'),
      ('P002', 'Cafe Latte', 'Coffee', 25000, 'Espresso dengan susu steamed'),
      ('P003', 'Kopi Susu Aren', 'Coffee', 22000, 'Kopi susu dengan gula aren')`);

    console.log('Inserting Product Ingredients...');
    await pool.query(`INSERT INTO tb_product_ing (tb_product_product_id, tb_ing_ing_id, qty_used) VALUES
      ('P001', 1, 18),
      ('P002', 1, 18), ('P002', 2, 150),
      ('P003', 1, 18), ('P003', 2, 120), ('P003', 3, 20)`);

    console.log('Inserting Orders...');
    await pool.query(`INSERT INTO tb_order (order_id, order_date, total_price, status, tb_customer_customer_id, tb_barista_barista_id, tb_meja_meja_id) VALUES
      (1, CURRENT_DATE, 40000, 'Completed', 1, 1, 1)`);

    console.log('Inserting Order Details...');
    await pool.query(`INSERT INTO tb_order_detail (order_detail_id, qty, price, subtotal, tb_product_product_id, tb_order_order_id) VALUES
      (1, 1, 18000, 18000, 'P001', 1),
      (2, 1, 22000, 22000, 'P003', 1)`);

    await pool.query('COMMIT');
    console.log('Seed berhasil ditambahkan!');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Seed gagal:', error);
  } finally {
    pool.end();
  }
}

seed();
