const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.post('/stock/:productId/stocks', stockController.addStockToProduct);
router.put('/products/:productId/stock/:stockId', stockController.updateStock);
router.get('/products/:product_id/stock', stockController.getStock);
router.get('/products', stockController.getAllProductsWithStock);
router.post('/reduceStock', stockController.reduceStock);
router.post('/incrementStock', stockController.increaseStock);

module.exports = router;

