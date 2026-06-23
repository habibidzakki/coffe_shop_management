const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/reports/dashboard', reportController.getDashboardData);

module.exports = router;
