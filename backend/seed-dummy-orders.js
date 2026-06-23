const pool = require('./src/config/db');

async function seedOrders() {
  try {
    await pool.query('BEGIN');
    
    // Create random orders for the past 7 days
    for (let i = 6; i >= 0; i--) {
      // 5-15 orders per day
      const orderCount = Math.floor(Math.random() * 10) + 5;
      
      for (let j = 0; j < orderCount; j++) {
        const orderIdResult = await pool.query('SELECT COALESCE(MAX(order_id), 0) + 1 AS next_id FROM tb_order');
        const nextOrderId = orderIdResult.rows[0].next_id;
        
        // Random price between 50000 and 200000
        const totalPrice = Math.floor(Math.random() * 150000) + 50000;
        
        await pool.query(
          `INSERT INTO tb_order (order_id, order_date, total_price, status, tb_customer_customer_id, tb_barista_barista_id, tb_meja_meja_id, payment_method)
           VALUES ($1, CURRENT_DATE - INTERVAL '${i} days', $2, 'Completed', 1, 1, 1, 'Qris')`,
          [nextOrderId, totalPrice]
        );
      }
    }
    
    await pool.query('COMMIT');
    console.log('Dummy orders seeded successfully for the past 7 days!');
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error seeding dummy orders:', err);
  } finally {
    pool.end();
  }
}

seedOrders();
