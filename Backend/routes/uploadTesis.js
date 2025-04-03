const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../db/db");

const router = express.Router();

// Configuración de multer para guardar archivos PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Ruta para subir tesis
router.post("/", upload.single("documento"), async (req, res) => {
  const { titulo, fecha_pub, des_tesis, id_carrera, nom_autor } = req.body;
  const documento = req.file ? req.file.filename : null;

  if (!documento) {
    return res.status(400).json({ error: "Archivo PDF es requerido" });
  }

  try {
    const query = `
      INSERT INTO tesis (titulo, fecha_pub, des_tesis, id_carrera, nom_autor, documento)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.query(query, [titulo, fecha_pub, des_tesis, id_carrera, nom_autor, documento]);
    res.status(201).json({ mensaje: "Tesis subida exitosamente" });
  } catch (error) {
    console.error("Error al subir tesis:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;