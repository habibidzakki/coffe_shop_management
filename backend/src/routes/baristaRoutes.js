const express = require('express');
const router = express.Router();
const baristaController = require('../controllers/baristaController');

router.get('/baristas', baristaController.getAll);
router.post('/baristas', baristaController.create);
router.put('/baristas/:id', baristaController.update);
router.delete('/baristas/:id', baristaController.delete);

module.exports = router;
