const express = require('express');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');

const app = express();

app.use(express.json());
app.use('/api', productRoutes);
app.use('/api', stockRoutes);

module.exports = app;
