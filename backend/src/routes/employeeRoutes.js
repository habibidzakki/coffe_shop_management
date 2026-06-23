const express = require('express');
const EmployeeController = require('../controllers/employeeController');

const router = express.Router();

router.get('/employees', EmployeeController.getAll);

module.exports = router;
