const { Stock, Product, sequelize } = require('../models');

exports.addStockToProduct = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
      const productId = parseInt(req.params.productId, 10);

      // Verificar si el producto existe
      const product = await Product.findByPk(productId);
      if (!product) {
          await transaction.rollback();
          return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Verificar que el cuerpo de la solicitud contenga los datos necesarios
      const { size, quantity } = req.body;
      if (!size || !quantity) {
          await transaction.rollback();
          return res.status(400).json({ error: "Faltan campos size o quantity" });
      }

      // Crear la entrada de stock para el producto
      const stock = await Stock.create({
          product_id: productId,
          size: size,
          quantity: quantity,
      }, { transaction });

      await transaction.commit();

      // Obtener el producto actualizado con el stock añadido
      const updatedProduct = await Product.findByPk(productId, {
          include: [{
              model: Stock,
              attributes: ['size', 'quantity']
          }]
      });

      res.status(201).json({ product: updatedProduct });
  } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
  }
};


exports.updateStock = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
      const productId = parseInt(req.params.productId, 10);
      const stockId = parseInt(req.params.stockId, 10);

      // Verificar si el producto existe
      const product = await Product.findByPk(productId);
      if (!product) {
          await transaction.rollback();
          return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Verificar si la entrada de stock existe
      const stock = await Stock.findOne({ where: { stock_id: stockId, product_id: productId } });
      if (!stock) {
          await transaction.rollback();
          return res.status(404).json({ error: "Entrada de stock no encontrada" });
      }

      // Verificar que el cuerpo de la solicitud contenga los datos necesarios
      const { size, quantity } = req.body;
      if (!size && !quantity) {
          await transaction.rollback();
          return res.status(400).json({ error: "Faltan campos size o quantity" });
      }

      // Actualizar la entrada de stock con los valores proporcionados
      await stock.update({
          size: size || stock.size,
          quantity: quantity || stock.quantity,
      }, { transaction });

      await transaction.commit();

      // Obtener el producto actualizado con el stock actualizado
      const updatedProduct = await Product.findByPk(productId, {
          include: [{
              model: Stock,
              attributes: ['size', 'quantity']
          }]
      });

      res.status(200).json({ product: updatedProduct });
  } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
  }
};



exports.getStock = async (req, res) => {
  try {
      const { product_id } = req.params;

      // Buscar el producto e incluir todas las entradas de stock asociadas
      const productWithStock = await Product.findByPk(product_id, {
          include: [{
              model: Stock,
              attributes: ['size', 'quantity'] // Atributos que deseas ver del stock
          }]
      });

      // Verificar si el producto existe
      if (!productWithStock) {
          return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.status(200).json(productWithStock);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


exports.getAllProductsWithStock = async (req, res) => {
    try {
        // Buscar todos los productos e incluir todas las entradas de stock asociadas
        const productsWithStock = await Product.findAll({
            include: [{
                model: Stock,
                attributes: ['size', 'quantity'] // Atributos que deseas ver del stock
            }]
        });
  
        // Verificar si hay productos
        if (productsWithStock.length === 0) {
            return res.status(404).json({ error: "No se encontraron productos" });
        }
  
        res.status(200).json(productsWithStock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };
  
 
  
  exports.reduceStock = async (req, res) => {
    try {
      const { product_id, size, quantity } = req.body; 
  

      const stock = await Stock.findOne({
        where: {
          product_id: product_id, 
          size: size 
        }
      });
  
   
      if (!stock) {
        return res.status(404).json({ error: "Stock no encontrado para este producto y tamaño" });
      }
  
      
      if (stock.quantity < quantity) {
        return res.status(400).json({ error: "No hay suficiente stock disponible" });
      }
  
   
      stock.quantity -= quantity;
      
   
      await stock.save();
  

      res.status(200).json({ message: "Stock actualizado correctamente", newStock: stock.quantity });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  


  exports.increaseStock = async (req, res) => {
    try {
      const { product_id, size, quantity } = req.body; 
  
      const stock = await Stock.findOne({
        where: {
          product_id: product_id, 
          size: size 
        }
      });
   
      if (!stock) {
        return res.status(404).json({ error: "Stock no encontrado para este producto y tamaño" });
      }

      stock.quantity += quantity;

      await stock.save();

      res.status(200).json({ message: "Stock actualizado correctamente", newStock: stock.quantity });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  
