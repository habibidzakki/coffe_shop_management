const CustomerModel = require('../models/customerModel');

const CustomerController = {
  async getAll(req, res) {
    try {
      const customers = await CustomerModel.getAll();
      res.json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const customer = await CustomerModel.create(req.body);
      res.status(201).json({ success: true, message: 'Pelanggan berhasil ditambahkan', data: customer });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const customer = await CustomerModel.update(req.params.id, req.body);
      if (!customer) return res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan' });
      res.json({ success: true, message: 'Pelanggan berhasil diubah', data: customer });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const customer = await CustomerModel.delete(req.params.id);
      if (!customer) return res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan' });
      res.json({ success: true, message: 'Pelanggan berhasil dihapus', data: customer });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = CustomerController;
