const mysql = require('mysql2/promise');

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Cambia según tu configuración
  user: process.env.DB_USER || 'root',      // Usuario de tu base de datos
  password: process.env.DB_PASS || '30200228', // Contraseña de tu base de datos
  database: process.env.DB_NAME || 'bibliotecav', // Nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(() => console.log("Conectado a MySQL"))
  .catch((error) => {
    console.error("Error al conectar a MySQL:", error.message);
    process.exit(1);
  });

module.exports = pool;