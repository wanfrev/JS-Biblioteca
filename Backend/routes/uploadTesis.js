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

// Ruta para obtener todas las tesis o aplicar filtros
router.get("/", async (req, res) => {
  const { carrera, autor, fecha, orden, query } = req.query;

  try {
    let sqlQuery = `
      SELECT t.id_tesis, t.titulo, t.fecha_pub, t.des_tesis, c.car_nom AS carrera, a.nom_autor AS autor, t.documento
      FROM tesis t
      LEFT JOIN carrera c ON t.id_carrera = c.id_carrera
      LEFT JOIN autor_tesis at ON t.id_tesis = at.id_tesis
      LEFT JOIN autores a ON at.id_autor = a.id_autor
      WHERE 1=1
    `;

    const params = [];

    if (carrera) {
      sqlQuery += " AND c.car_nom = ?";
      params.push(carrera);
    }

    if (autor) {
      sqlQuery += " AND a.nom_autor LIKE ?";
      params.push(`%${autor}%`);
    }

    if (fecha) {
      sqlQuery += " AND t.fecha_pub = ?";
      params.push(fecha);
    }

    if (query) {
      sqlQuery += " AND (t.titulo LIKE ? OR a.nom_autor LIKE ?)";
      params.push(`%${query}%`, `%${query}%`);
    }

    if (orden === "alfabetico") {
      sqlQuery += " ORDER BY t.titulo ASC";
    } else if (orden === "fecha") {
      sqlQuery += " ORDER BY t.fecha_pub DESC";
    }

    const [tesis] = await db.query(sqlQuery, params);
    res.json(tesis);
  } catch (error) {
    console.error("Error al obtener las tesis:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// Ruta para obtener todas las tesis eliminadas
router.get("/eliminadas", async (req, res) => {
  try {
    const [tesisEliminadas] = await db.query(`
      SELECT id_tesis, titulo, fecha_pub, des_tesis, id_carrera, documento, id_admin
      FROM tesis_eliminadas
    `);

    console.log("Tesis eliminadas encontradas:", tesisEliminadas);

    res.json(tesisEliminadas);
  } catch (error) {
    console.error("Error al obtener las tesis eliminadas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para obtener todas las tesis o una tesis específica por ID
router.get("/:id?", async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      // Obtener una tesis específica por ID
      const [tesis] = await db.query(`
        SELECT t.id_tesis, t.titulo, t.fecha_pub, t.des_tesis, c.car_nom AS carrera, a.nom_autor AS autor, t.documento
        FROM tesis t
        LEFT JOIN carrera c ON t.id_carrera = c.id_carrera
        LEFT JOIN autor_tesis at ON t.id_tesis = at.id_tesis
        LEFT JOIN autores a ON at.id_autor = a.id_autor
        WHERE t.id_tesis = ?
      `, [id]);

      if (tesis.length === 0) {
        return res.status(404).json({ error: "Tesis no encontrada" });
      }

      return res.json(tesis[0]);
    } else {
      // Obtener todas las tesis
      const [tesis] = await db.query(`
        SELECT t.id_tesis, t.titulo, t.fecha_pub, t.des_tesis, c.car_nom AS carrera, a.nom_autor AS autor, t.documento
        FROM tesis t
        LEFT JOIN carrera c ON t.id_carrera = c.id_carrera
        LEFT JOIN autor_tesis at ON t.id_tesis = at.id_tesis
        LEFT JOIN autores a ON at.id_autor = a.id_autor
      `);

      return res.json(tesis);
    }
  } catch (error) {
    console.error("Error al obtener las tesis:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para editar una tesis
router.put("/:id", upload.single("documento"), async (req, res) => {
  const { id } = req.params;
  const { titulo, fecha_pub, des_tesis, id_carrera, nom_autor } = req.body;
  const documento = req.file ? req.file.filename : null;

  console.log("Datos recibidos para editar:", req.body);
  console.log("Archivo subido:", req.file);

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

    // Actualizar la tesis
    const updateQuery = `
      UPDATE tesis
      SET titulo = ?, fecha_pub = ?, des_tesis = ?, id_carrera = ?, documento = ?
      WHERE id_tesis = ?
    `;
    const updateValues = [titulo, fecha_pub, des_tesis, id_carrera, documento || null, id];
    await db.query(updateQuery, updateValues);

    // Actualizar la relación autor-tesis
    await db.query("UPDATE autor_tesis SET id_autor = ? WHERE id_tesis = ?", [autor.id_autor, id]);

    res.status(200).json({ mensaje: "Tesis actualizada exitosamente" });
  } catch (error) {
    console.error("Error al editar la tesis:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para eliminar una tesis y respaldarla
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener los datos de la tesis antes de eliminarla
    const [tesis] = await db.query("SELECT * FROM tesis WHERE id_tesis = ?", [id]);

    if (tesis.length === 0) {
      return res.status(404).json({ error: "Tesis no encontrada" });
    }

    const { titulo, fecha_pub, des_tesis, id_carrera, documento, id_admin } = tesis[0];

    // Respaldar los datos en la tabla tesis_eliminadas
    await db.query(
      `INSERT INTO tesis_eliminadas (titulo, fecha_pub, des_tesis, id_carrera, documento, id_admin)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [titulo, fecha_pub, des_tesis, id_carrera, documento, id_admin]
    );

    // Eliminar la tesis de la tabla original
    await db.query("DELETE FROM tesis WHERE id_tesis = ?", [id]);

    res.status(200).json({ mensaje: "Tesis eliminada y respaldada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la tesis:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para restaurar una tesis eliminada
router.post("/restaurar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener los datos de la tesis eliminada
    const [tesisEliminada] = await db.query("SELECT * FROM tesis_eliminadas WHERE id_tesis = ?", [id]);

    if (tesisEliminada.length === 0) {
      return res.status(404).json({ error: "Tesis no encontrada en el respaldo" });
    }

    const { titulo, fecha_pub, des_tesis, id_carrera, documento, id_admin } = tesisEliminada[0];

    // Restaurar la tesis en la tabla original
    await db.query(
      `INSERT INTO tesis (titulo, fecha_pub, des_tesis, id_carrera, documento, id_admin)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [titulo, fecha_pub, des_tesis, id_carrera, documento, id_admin]
    );

    // Eliminar la tesis del respaldo
    await db.query("DELETE FROM tesis_eliminadas WHERE id_tesis = ?", [id]);

    res.status(200).json({ mensaje: "Tesis restaurada exitosamente" });
  } catch (error) {
    console.error("Error al restaurar la tesis:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para obtener todas las carreras
router.get("/carreras", async (req, res) => {
  try {
    const [carreras] = await db.query("SELECT id_carrera, car_nom FROM carrera");
    res.json(carreras);
  } catch (error) {
    console.error("Error al obtener las carreras:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;