const bucket = require('../config/firebaseConfig');

// Función para subir un archivo a Firebase Storage
const firebaseUpload = async (file) => {
    try {
        if (!file) {
            throw new Error('No se proporcionó un archivo');
        }

        // Define el archivo en la raíz del bucket (sin carpeta)
        const fileRef = bucket.file(`${Date.now()}_${file.originalname}`);

        // Sube el archivo a Firebase Storage
        await fileRef.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
        });

        // Hace que el archivo sea público
        await fileRef.makePublic();

        // Genera la URL pública del archivo subido
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
        return publicUrl;  // Aquí retornamos solo una URL, no un array

    } catch (error) {
        console.error('Error al subir la imagen:', error);
        throw new Error(`Error al subir la imagen: ${error.message}`);
    }
};

module.exports = firebaseUpload;
