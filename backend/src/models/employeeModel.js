const pool = require('../config/db');

const EmployeeModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM tb_barista ORDER BY barista_id ASC');
    // Map to old fields so we don't break too much frontend logic
    return result.rows.map(row => ({
      employee_id: row.barista_id,
      employee_name: row.barista_name,
      position: row.shift, // shift maps to position for frontend display
      phone: row.phone_number
    }));
  }
};

module.exports = EmployeeModel;
