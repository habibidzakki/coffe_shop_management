const express = require('express');
const CustomerController = require('../controllers/customerController');

const router = express.Router();

router.get('/customers', CustomerController.getAll);
router.post('/customers', CustomerController.create);
router.put('/customers/:id', CustomerController.update);
router.delete('/customers/:id', CustomerController.delete);

module.exports = router;
