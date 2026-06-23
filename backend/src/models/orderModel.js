const pool = require('../config/db');

const OrderModel = {
  async getAll() {
    const query = `
      SELECT
        o.order_id,
        o.tb_customer_customer_id AS customer_id,
        COALESCE(c.customer_name, 'Guest') AS customer_name,
        o.tb_barista_barista_id AS employee_id,
        b.barista_name AS employee_name,
        o.order_date,
        o.status AS order_status,
        o.total_price AS total_amount,
        o.payment_method,
        'Paid' AS payment_status
      FROM tb_order o
      LEFT JOIN tb_customer c ON o.tb_customer_customer_id = c.customer_id
      JOIN tb_barista b ON o.tb_barista_barista_id = b.barista_id
      ORDER BY o.order_id DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async getDetail(orderId) {
    const query = `
      SELECT
        od.order_detail_id,
        od.tb_order_order_id AS order_id,
        od.tb_product_product_id AS menu_id,
        p.product_name AS menu_name,
        od.qty AS quantity,
        od.price AS price_at_order,
        od.subtotal
      FROM tb_order_detail od
      JOIN tb_product p ON od.tb_product_product_id = p.product_id
      WHERE od.tb_order_order_id = $1
      ORDER BY od.order_detail_id ASC
    `;
    const result = await pool.query(query, [orderId]);
    return result.rows;
  },

  async create(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { customer_id, employee_id, items, meja_id, payment_method } = data;

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('Item pesanan tidak boleh kosong');
      }

      // Generate order ID manually
      const orderIdResult = await client.query('SELECT COALESCE(MAX(order_id), 0) + 1 AS next_id FROM tb_order');
      const nextOrderId = orderIdResult.rows[0].next_id;

      const orderResult = await client.query(
        `INSERT INTO tb_order (order_id, order_date, total_price, status, tb_customer_customer_id, tb_barista_barista_id, tb_meja_meja_id, payment_method)
         VALUES ($1, CURRENT_DATE, 0, 'Completed', $2, $3, $4, $5)
         RETURNING *`,
        [nextOrderId, customer_id || 1, employee_id, meja_id || 1, payment_method || 'Cash']
      );

      const order = orderResult.rows[0];
      let total = 0;

      for (const item of items) {
        const productResult = await client.query(
          'SELECT product_id, product_name, price FROM tb_product WHERE product_id = $1',
          [item.menu_id]
        );

        if (productResult.rows.length === 0) {
          throw new Error(`Menu dengan ID ${item.menu_id} tidak ditemukan`);
        }

        const product = productResult.rows[0];
        const quantity = Number(item.quantity);
        const price = Number(product.price);
        const subtotal = price * quantity;
        
        total += subtotal;

        const odIdResult = await client.query('SELECT COALESCE(MAX(order_detail_id), 0) + 1 AS next_id FROM tb_order_detail');
        const nextOdId = odIdResult.rows[0].next_id;

        await client.query(
          `INSERT INTO tb_order_detail (order_detail_id, qty, price, subtotal, tb_product_product_id, tb_order_order_id)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [nextOdId, quantity, price, subtotal, product.product_id, order.order_id]
        );

        // Deduct stock based on recipe
        const recipeResult = await client.query(
          'SELECT tb_ing_ing_id AS ing_id, qty_used FROM tb_product_ing WHERE tb_product_product_id = $1',
          [product.product_id]
        );
        for (const ing of recipeResult.rows) {
          const totalUsed = ing.qty_used * quantity;
          await client.query(
            'UPDATE tb_ing SET stock_qty = stock_qty - $1 WHERE ing_id = $2',
            [totalUsed, ing.ing_id]
          );
        }
      }

      const updatedOrderResult = await client.query(
        'UPDATE tb_order SET total_price = $1 WHERE order_id = $2 RETURNING *',
        [total, order.order_id]
      );

      await client.query('COMMIT');
      return updatedOrderResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async delete(orderId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM tb_order_detail WHERE tb_order_order_id = $1', [orderId]);
      const result = await client.query('DELETE FROM tb_order WHERE order_id = $1 RETURNING *', [orderId]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

module.exports = OrderModel;
