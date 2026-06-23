const express = require('express');
const router = express.Router();
const ingController = require('../controllers/ingController');

router.get('/ingredients', ingController.getAll);
router.post('/ingredients', ingController.create);
router.put('/ingredients/:id', ingController.update);
router.delete('/ingredients/:id', ingController.delete);

module.exports = router;
