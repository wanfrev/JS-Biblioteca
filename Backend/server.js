require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./db/db');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

db.getConnection()
  .then(() => console.log("Conexión a MySQL exitosa"))
  .catch((error) => {
    console.error("Error al conectar a MySQL:", error.message);
    process.exit(1);
  });

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
app.use(
  cors({
    origin: ["http://127.0.0.1:5500"], // Asegúrate de incluir ambas opciones
    credentials: true, // Permite el envío de cookies
  })
);

app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use('/upload', express.static(path.join(__dirname, 'upload'))); 

app.use('/api', routes);

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`Ruta registrada: ${middleware.route.path}`);
  }
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});