const express = require('express');
const OrderController = require('../controllers/orderController');

const router = express.Router();

router.get('/orders', OrderController.getAll);
router.get('/orders/:id/details', OrderController.getDetail);
router.post('/orders', OrderController.create);
router.put('/orders/:id/status', OrderController.updateStatus);
router.delete('/orders/:id', OrderController.delete);

module.exports = router;
