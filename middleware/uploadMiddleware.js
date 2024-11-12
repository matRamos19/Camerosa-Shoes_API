const multer = require('multer');
const storage = multer.memoryStorage(); // Guardamos los archivos en memoria

const upload = multer({
  storage: storage,
});

module.exports = upload.fields([
  { name: 'qrCode', maxCount: 1 },    // Campo para el código QR
  { name: 'barcode', maxCount: 1 },  //campo para el codigo Bar
  { name: 'image', maxCount: 1 }
]);
