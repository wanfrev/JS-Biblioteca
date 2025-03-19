require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/db'); // Importar el pool de conexiones
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

// Verificar la conexión a la base de datos
db.getConnection()
  .then(() => console.log("Conexión a MySQL exitosa"))
  .catch((error) => {
    console.error("Error al conectar a MySQL:", error.message);
    process.exit(1);
  });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos

// Usar las rutas
app.use('/api', routes);

// Manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});