const OrderModel = require('../models/orderModel');

const OrderController = {
  async getAll(req, res) {
    try {
      const orders = await OrderModel.getAll();
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getDetail(req, res) {
    try {
      const details = await OrderModel.getDetail(req.params.id);
      res.json({ success: true, data: details });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const order = await OrderModel.create(req.body);
      res.status(201).json({ success: true, message: 'Pesanan berhasil dibuat', data: order });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const order = await OrderModel.updateStatus(req.params.id, req.body.order_status);
      if (!order) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
      res.json({ success: true, message: 'Status pesanan berhasil diubah', data: order });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const order = await OrderModel.delete(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
      res.json({ success: true, message: 'Pesanan berhasil dihapus', data: order });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = OrderController;
