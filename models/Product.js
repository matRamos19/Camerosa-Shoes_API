module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      model_name: DataTypes.STRING,
      category: DataTypes.STRING,
      description: DataTypes.TEXT,
      plataform: DataTypes.FLOAT,
      price: DataTypes.DECIMAL,
      qrCodeUrl: DataTypes.STRING,
      barcodeUrl: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false 
    },
    }, {
      timestamps: true
    });
  
    return Product;
  };
  