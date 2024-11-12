module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    stock_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products', // Asegúrate de que este sea el nombre correcto de la tabla en la base de datos
        key: 'product_id'
      }
    },
    size: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
  }, {
   
    timestamps: true, // esto habilitará createdAt y updatedAt automáticamente
   
  });

  return Stock;
};
