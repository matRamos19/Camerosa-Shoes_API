const Sequelize = require('sequelize');
const config = require('../config/config').development;
const fs = require('fs');
const path = require('path');

// Crear una instancia de Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Leer todos los archivos de modelo
const models = {};
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Configurar las relaciones entre modelos aquí, si es necesario
// Por ejemplo, si Product y Stock están relacionados
models.Product.hasMany(models.Stock, { foreignKey: 'product_id' });
models.Stock.belongsTo(models.Product, { foreignKey: 'product_id' });

// Exportar la instancia de sequelize y modelos
module.exports = {
  sequelize,
  Sequelize,
  ...models
};
