const pool = require('../config/db');

const CustomerModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM tb_customer ORDER BY customer_id DESC');
    return result.rows;
  },

  async create(data) {
    const { customer_name, email, phone } = data;
    const query = `
      INSERT INTO tb_customer (customer_id, customer_name, email, phone, points)
      VALUES ((SELECT COALESCE(MAX(customer_id), 0) + 1 FROM tb_customer), $1, $2, $3, 0)
      RETURNING *
    `;
    const result = await pool.query(query, [customer_name, email, phone]);
    return result.rows[0];
  },

  async update(id, data) {
    const { customer_name, email, phone } = data;
    const query = `
      UPDATE tb_customer 
      SET customer_name = $1, email = $2, phone = $3
      WHERE customer_id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [customer_name, email, phone, id]);
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM tb_customer WHERE customer_id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = CustomerModel;
