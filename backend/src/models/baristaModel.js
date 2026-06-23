const pool = require('../config/db');

const BaristaModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM tb_barista ORDER BY barista_id ASC');
    return result.rows;
  },

  async create(data) {
    const { barista_name, shift, phone_number } = data;
    const query = `
      INSERT INTO tb_barista (barista_id, barista_name, shift, phone_number)
      VALUES ((SELECT COALESCE(MAX(barista_id), 0) + 1 FROM tb_barista), $1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [barista_name, shift, phone_number]);
    return result.rows[0];
  },

  async update(id, data) {
    const { barista_name, shift, phone_number } = data;
    const query = `
      UPDATE tb_barista 
      SET barista_name = $1, shift = $2, phone_number = $3
      WHERE barista_id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [barista_name, shift, phone_number, id]);
    return result.rows[0];
  },

  async delete(id) {
    // Note: Do not delete if there are orders linked, or let DB throw error
    const result = await pool.query('DELETE FROM tb_barista WHERE barista_id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = BaristaModel;
