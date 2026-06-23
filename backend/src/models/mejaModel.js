const pool = require('../config/db');

const MejaModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM tb_meja ORDER BY meja_id ASC');
    return result.rows;
  },

  async create(data) {
    const { nomor_meja, kapasitas, status } = data;
    const query = `
      INSERT INTO tb_meja (meja_id, nomor_meja, kapasitas, status)
      VALUES ((SELECT COALESCE(MAX(meja_id), 0) + 1 FROM tb_meja), $1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [nomor_meja, kapasitas, status || 'Available']);
    return result.rows[0];
  },

  async update(id, data) {
    const { nomor_meja, kapasitas, status } = data;
    const query = `
      UPDATE tb_meja 
      SET nomor_meja = $1, kapasitas = $2, status = $3
      WHERE meja_id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [nomor_meja, kapasitas, status, id]);
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM tb_meja WHERE meja_id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = MejaModel;
