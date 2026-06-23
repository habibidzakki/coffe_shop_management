const BaristaModel = require('../models/baristaModel');

const baristaController = {
  async getAll(req, res) {
    try {
      const baristas = await BaristaModel.getAll();
      res.json({ success: true, data: baristas });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const barista = await BaristaModel.create(req.body);
      res.status(201).json({ success: true, data: barista });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const barista = await BaristaModel.update(req.params.id, req.body);
      res.json({ success: true, data: barista });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await BaristaModel.delete(req.params.id);
      res.json({ success: true, message: 'Barista berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = baristaController;
