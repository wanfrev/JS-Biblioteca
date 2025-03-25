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

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.use('/api', routes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});