const express = require('express');
const router = express.Router();
const mejaController = require('../controllers/mejaController');

router.get('/tables', mejaController.getAll);
router.post('/tables', mejaController.create);
router.put('/tables/:id', mejaController.update);
router.delete('/tables/:id', mejaController.delete);

module.exports = router;
