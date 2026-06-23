const MejaModel = require('../models/mejaModel');

const mejaController = {
  async getAll(req, res) {
    try {
      const tables = await MejaModel.getAll();
      res.json({ success: true, data: tables });
    } catch (error) {
      console.error('Error fetching tables:', error);
      res.status(500).json({ success: false, message: 'Gagal mengambil data meja' });
    }
  },

  async create(req, res) {
    try {
      const meja = await MejaModel.create(req.body);
      res.status(201).json({ success: true, message: 'Meja berhasil ditambahkan', data: meja });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const meja = await MejaModel.update(req.params.id, req.body);
      if (!meja) return res.status(404).json({ success: false, message: 'Meja tidak ditemukan' });
      res.json({ success: true, message: 'Meja berhasil diubah', data: meja });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const meja = await MejaModel.delete(req.params.id);
      if (!meja) return res.status(404).json({ success: false, message: 'Meja tidak ditemukan' });
      res.json({ success: true, message: 'Meja berhasil dihapus', data: meja });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = mejaController;
