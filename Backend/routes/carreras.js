const express = require("express");
const db = require("../db/db");

const router = express.Router();

// Backend: Ruta para obtener carreras
router.get("/carreras", async (req, res) => {
  try {
    const [carreras] = await db.query("SELECT id_carrera, car_nom FROM carrera");
    res.json(carreras); // Asegúrate de devolver un arreglo
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;