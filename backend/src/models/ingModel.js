const pool = require('../config/db');

const IngModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM tb_ing ORDER BY ing_id ASC');
    return result.rows;
  },

  async create(data) {
    const { ing_name, stock_qty, unit } = data;
    const query = `
      INSERT INTO tb_ing (ing_id, ing_name, stock_qty, unit)
      VALUES ((SELECT COALESCE(MAX(ing_id), 0) + 1 FROM tb_ing), $1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [ing_name, stock_qty, unit]);
    return result.rows[0];
  },

  async update(id, data) {
    const { ing_name, stock_qty, unit } = data;
    const query = `
      UPDATE tb_ing 
      SET ing_name = $1, stock_qty = $2, unit = $3
      WHERE ing_id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [ing_name, stock_qty, unit, id]);
    return result.rows[0];
  },

  async delete(id) {
    // Delete mapping first if exists
    await pool.query('DELETE FROM tb_product_ing WHERE tb_ing_ing_id = $1', [id]);
    const result = await pool.query('DELETE FROM tb_ing WHERE ing_id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = IngModel;
