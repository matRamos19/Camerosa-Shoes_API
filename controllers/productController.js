const { Product, Stock, sequelize } = require('../models'); // Asegúrate de importar sequelize
const uploadFileToFirebase = require('../services/firebaseUploadService');

exports.createProduct = async (req, res) => { //El product lo deje tal y como está, el unico cambio que hice fue en ves de manejar el stock acá, lo manejo en el controlador Stock
  const transaction = await sequelize.transaction();

  try {
    let qrCodeUrl, barcodeUrl, imageUrl;

    if (req.files['qrCode']) qrCodeUrl = await uploadFileToFirebase(req.files['qrCode'][0]);
    if (req.files['barcode']) barcodeUrl = await uploadFileToFirebase(req.files['barcode'][0]);
    if (req.files['image']) imageUrl = await uploadFileToFirebase(req.files['image'][0]);

    const product = await Product.create({
      model_name: req.body.model_name,
      plataform: req.body.plataform,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      imageUrl: imageUrl,
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ product });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};


// Eliminar Producto
exports.deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
   
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Id del producto inválido" });
    }

    const product = await Product.findOne({ where: { product_id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    await product.update({ isDeleted: true });

    res.status(200).json({ message: "Producto marcado como eliminado correctamente" });
  } catch (error) {
    console.error('Error al marcar producto como eliminado:', error);
    res.status(500).json({ error: error.message });
  }
};


// Actualizar Producto
exports.updateProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params; // ID del producto a actualizar
    let qrCodeUrl, barcodeUrl, imageUrl;

    // Solo se actualizarán los archivos que estén presentes en la solicitud
    if (req.files['qrCode']) qrCodeUrl = await uploadFileToFirebase(req.files['qrCode'][0]);
    if (req.files['barcode']) barcodeUrl = await uploadFileToFirebase(req.files['barcode'][0]);
    if (req.files['image']) imageUrl = await uploadFileToFirebase(req.files['image'][0]);

    // Buscar el producto existente
    const product = await Product.findByPk(id, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar solo los campos que fueron enviados
    await product.update({
      model_name: req.body.model_name || product.model_name,
      plataform: req.body.plataform || product.plataform,
      category: req.body.category || product.category,
      description: req.body.description || product.description,
      price: req.body.price || product.price,
      imageUrl: imageUrl || product.imageUrl,
    }, { transaction });

    await transaction.commit();
    res.status(200).json({ product });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

