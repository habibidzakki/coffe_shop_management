const pool = require('./src/config/db');
async function run() {
  try {
    await pool.query('ALTER TABLE tb_order ADD COLUMN payment_method VARCHAR(50) DEFAULT \'Cash\'');
    console.log('Column added');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
