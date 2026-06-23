const IngModel = require('../models/ingModel');

const ingController = {
  async getAll(req, res) {
    try {
      const ings = await IngModel.getAll();
      res.json({ success: true, data: ings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const ing = await IngModel.create(req.body);
      res.status(201).json({ success: true, data: ing });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const ing = await IngModel.update(req.params.id, req.body);
      res.json({ success: true, data: ing });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await IngModel.delete(req.params.id);
      res.json({ success: true, message: 'Bahan baku berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = ingController;
