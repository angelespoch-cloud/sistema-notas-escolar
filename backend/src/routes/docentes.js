const express = require('express');
const { run, all } = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
  const rows = await all('SELECT * FROM docentes ORDER BY id DESC');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { nombre, email, especialidad } = req.body;
  if (!nombre || !email || !especialidad) {
    return res.status(400).json({ error: 'nombre, email y especialidad son obligatorios' });
  }

  try {
    const result = await run(
      'INSERT INTO docentes (nombre, email, especialidad) VALUES (?, ?, ?)',
      [nombre, email, especialidad]
    );
    return res.status(201).json({ id: result.id, nombre, email, especialidad });
  } catch (error) {
    return res.status(409).json({ error: error.message });
  }
});

module.exports = router;
