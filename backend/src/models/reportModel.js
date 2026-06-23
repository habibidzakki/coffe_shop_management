const pool = require('../config/db');

const ReportModel = {
  async getBestSellers() {
    const query = `
      SELECT 
        m.product_name AS menu_name,
        SUM(od.qty) as total_sold
      FROM tb_order_detail od
      JOIN tb_product m ON od.tb_product_product_id = m.product_id
      JOIN tb_order o ON od.tb_order_order_id = o.order_id
      WHERE o.status != 'Cancelled'
      GROUP BY m.product_id, m.product_name
      ORDER BY total_sold DESC
      LIMIT 5
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async getRecentRevenue() {
    const query = `
      SELECT 
        TO_CHAR(DATE(order_date), 'DD Mon') as date_label,
        SUM(total_price) as daily_revenue
      FROM tb_order
      WHERE status != 'Cancelled' 
        AND order_date >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY DATE(order_date)
      ORDER BY DATE(order_date) ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async getTotalRevenue(filter) {
    let dateCondition = "1=1";
    if (filter === 'today') {
      dateCondition = "DATE(order_date) = CURRENT_DATE";
    } else if (filter === 'week') {
      dateCondition = "order_date >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (filter === 'month') {
      dateCondition = "EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE)";
    }

    const query = `
      SELECT COALESCE(SUM(total_price), 0) as total_revenue
      FROM tb_order
      WHERE status != 'Cancelled' AND ${dateCondition}
    `;
    const result = await pool.query(query);
    return result.rows[0].total_revenue;
  }
};

module.exports = ReportModel;
