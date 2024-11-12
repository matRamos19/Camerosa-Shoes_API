const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const productController = require('../controllers/productController');

// Ruta para crear un producto, permitiendo subir archivos
router.post('/products', upload, productController.createProduct);
router.delete('/delete/:id', productController.deleteProduct); //Que solo elimine pero en estado
router.put('/products/:id', upload, productController.updateProduct);


module.exports = router;
