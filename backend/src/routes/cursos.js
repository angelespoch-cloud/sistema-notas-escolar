const express = require('express');
const { run, all } = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
  const rows = await all('SELECT * FROM cursos ORDER BY id DESC');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { nombre, nivel, anio } = req.body;
  if (!nombre || !nivel || !anio) {
    return res.status(400).json({ error: 'nombre, nivel y anio son obligatorios' });
  }

  const result = await run(
    'INSERT INTO cursos (nombre, nivel, anio) VALUES (?, ?, ?)',
    [nombre, nivel, anio]
  );
  return res.status(201).json({ id: result.id, nombre, nivel, anio });
});

module.exports = router;
