const express = require('express');
const { sequelize } = require('./models');
const app = require('./app');
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Database synchronized");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to synchronize database:", error);
  }
})();
