-- =====================================================
-- SEED DATA: Coffee Shop Management
-- Jalankan setelah schema.sql
-- =====================================================

INSERT INTO categories (category_name, description) VALUES
('Coffee', 'Minuman berbasis kopi'),
('Non Coffee', 'Minuman tanpa kopi'),
('Food', 'Makanan ringan dan makanan utama'),
('Dessert', 'Makanan manis pendamping kopi');

INSERT INTO menu_items (category_id, menu_name, price, stock, is_available) VALUES
(1, 'Americano', 18000, 50, TRUE),
(1, 'Cappuccino', 24000, 40, TRUE),
(1, 'Cafe Latte', 25000, 40, TRUE),
(2, 'Matcha Latte', 27000, 35, TRUE),
(2, 'Chocolate Ice', 22000, 30, TRUE),
(3, 'French Fries', 20000, 25, TRUE),
(3, 'Chicken Sandwich', 32000, 20, TRUE),
(4, 'Brownies', 18000, 15, TRUE);

INSERT INTO customers (customer_name, phone, email) VALUES
('Budi Santoso', '081234567890', 'budi@mail.com'),
('Siti Aisyah', '082233445566', 'siti@mail.com'),
('Rama Putra', '083344556677', 'rama@mail.com');

INSERT INTO employees (employee_name, position, phone) VALUES
('Axell Ramadhani', 'Cashier', '081111111111'),
('Nadia Putri', 'Barista', '082222222222'),
('Rizky Maulana', 'Manager', '083333333333');

-- Contoh transaksi pertama
INSERT INTO orders (customer_id, employee_id, order_status, total_amount)
VALUES (1, 1, 'Completed', 42000);

INSERT INTO order_details (order_id, menu_id, quantity, price_at_order) VALUES
(1, 1, 1, 18000),
(1, 2, 1, 24000);

INSERT INTO payments (order_id, payment_method, payment_status, paid_amount, paid_at)
VALUES (1, 'QRIS', 'Paid', 42000, CURRENT_TIMESTAMP);
