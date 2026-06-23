const express = require('express');
const MenuController = require('../controllers/menuController');

const router = express.Router();

router.get('/categories', MenuController.getCategories);
router.get('/menus', MenuController.getAll);
router.get('/menus/:id', MenuController.getById);
router.post('/menus', MenuController.create);
router.put('/menus/:id', MenuController.update);
router.delete('/menus/:id', MenuController.delete);

module.exports = router;
