const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../db/db");

const router = express.Router();

// Configuración de multer para guardar archivos PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../upload"));
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

  console.log("Datos recibidos del formulario:", req.body);
  console.log("Archivo subido:", req.file);

  if (!documento) {
    return res.status(400).json({ error: "Archivo PDF es requerido" });
  }

  try {
    // Verificar si el autor ya existe
    let [autor] = await db.query("SELECT id_autor FROM autores WHERE nom_autor = ?", [nom_autor]);
    console.log("Autor encontrado o creado:", autor);

    if (!autor.length) {
      // Insertar el autor si no existe
      const [result] = await db.query("INSERT INTO autores (nom_autor) VALUES (?)", [nom_autor]);
      console.log("Resultado de la inserción del autor:", result);
      autor = { id_autor: result.insertId };
    } else {
      autor = autor[0];
    }

    // Insertar la tesis
    const [resultTesis] = await db.query(
      `INSERT INTO tesis (titulo, fecha_pub, des_tesis, id_carrera, id_admin, documento)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [titulo, fecha_pub, des_tesis, id_carrera, 1, documento]
    );

    const id_tesis = resultTesis.insertId;
    console.log("ID de la tesis insertada:", id_tesis);

    // Relacionar el autor con la tesis
    await db.query("INSERT INTO autor_tesis (id_tesis, id_autor) VALUES (?, ?)", [id_tesis, autor.id_autor]);

    res.status(201).json({ mensaje: "Tesis subida exitosamente" });
  } catch (error) {
    console.error("Error al subir tesis:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para obtener todas las tesis
router.get("/", async (req, res) => {
  try {
    const [tesis] = await db.query(`
      SELECT t.id_tesis, t.titulo, t.fecha_pub, t.des_tesis, c.car_nom AS carrera, a.nom_autor AS autor, t.documento
      FROM tesis t
      LEFT JOIN carrera c ON t.id_carrera = c.id_carrera
      LEFT JOIN autor_tesis at ON t.id_tesis = at.id_tesis
      LEFT JOIN autores a ON at.id_autor = a.id_autor
    `);
    res.json(tesis);
  } catch (error) {
    console.error("Error al obtener las tesis:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;