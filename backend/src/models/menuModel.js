const pool = require('../config/db');

const MenuModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM tb_product ORDER BY product_id ASC');
    return result.rows.map(row => ({
      menu_id: row.product_id,
      menu_name: row.product_name,
      category_name: row.category,
      category_id: row.category, // using category name as id for simplicity
      price: row.price,
      stock: 99, // default stock since it's removed from product
      is_available: true // default available
    }));
  },

  async getCategories() {
    const result = await pool.query('SELECT DISTINCT category AS category_name FROM tb_product ORDER BY category ASC');
    return result.rows.map(row => ({
      category_id: row.category_name,
      category_name: row.category_name
    }));
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM tb_product WHERE product_id = $1', [id]);
    const product = result.rows[0];
    if (product) {
      const ingResult = await pool.query('SELECT tb_ing_ing_id AS ing_id, qty_used FROM tb_product_ing WHERE tb_product_product_id = $1', [id]);
      product.ingredients = ingResult.rows;
    }
    return product;
  },

  async create(data) {
    const { menu_id, menu_name, category_id, price, description, ingredients } = data;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const query = `
        INSERT INTO tb_product (product_id, product_name, category, price, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const result = await client.query(query, [menu_id, menu_name, category_id, price, description || '']);
      const product = result.rows[0];

      if (ingredients && Array.isArray(ingredients)) {
        for (const ing of ingredients) {
          await client.query(
            'INSERT INTO tb_product_ing (qty_used, tb_product_product_id, tb_ing_ing_id) VALUES ($1, $2, $3)',
            [ing.qty_used, product.product_id, ing.ing_id]
          );
        }
      }
      
      await client.query('COMMIT');
      return product;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async update(id, data) {
    const { menu_name, category_id, price, description, ingredients } = data;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const query = `
        UPDATE tb_product 
        SET product_name = $1, category = $2, price = $3, description = $4
        WHERE product_id = $5
        RETURNING *
      `;
      const result = await client.query(query, [menu_name, category_id, price, description || '', id]);
      const product = result.rows[0];

      // Update ingredients: delete old, insert new
      await client.query('DELETE FROM tb_product_ing WHERE tb_product_product_id = $1', [id]);
      if (ingredients && Array.isArray(ingredients)) {
        for (const ing of ingredients) {
          await client.query(
            'INSERT INTO tb_product_ing (qty_used, tb_product_product_id, tb_ing_ing_id) VALUES ($1, $2, $3)',
            [ing.qty_used, id, ing.ing_id]
          );
        }
      }

      await client.query('COMMIT');
      return product;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async delete(id) {
    // Delete related order details first if necessary, or let DB handle cascade
    // For safety, delete from tb_order_detail first if no cascade exists
    await pool.query('DELETE FROM tb_order_detail WHERE tb_product_product_id = $1', [id]);
    const result = await pool.query('DELETE FROM tb_product WHERE product_id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = MenuModel;
