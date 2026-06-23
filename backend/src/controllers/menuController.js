const MenuModel = require('../models/menuModel');

const MenuController = {
  async getAll(req, res) {
    try {
      const menus = await MenuModel.getAll();
      res.json({ success: true, data: menus });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getCategories(req, res) {
    try {
      const categories = await MenuModel.getCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const menu = await MenuModel.getById(req.params.id);
      if (!menu) return res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
      res.json({ success: true, data: menu });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const menu = await MenuModel.create(req.body);
      res.status(201).json({ success: true, message: 'Menu berhasil ditambahkan', data: menu });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const menu = await MenuModel.update(req.params.id, req.body);
      if (!menu) return res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
      res.json({ success: true, message: 'Menu berhasil diubah', data: menu });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const menu = await MenuModel.delete(req.params.id);
      if (!menu) return res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
      res.json({ success: true, message: 'Menu berhasil dihapus', data: menu });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Menu tidak bisa dihapus jika sudah pernah masuk transaksi. Gunakan update stok/status saja.'
      });
    }
  }
};

module.exports = MenuController;
