const express = require('express');
const { run, all } = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
  const rows = await all(`
    SELECT e.id, e.nombre, e.apellido, e.documento, c.nombre AS curso
    FROM estudiantes e
    JOIN cursos c ON c.id = e.curso_id
    ORDER BY e.id DESC
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { nombre, apellido, documento, curso_id } = req.body;
  if (!nombre || !apellido || !documento || !curso_id) {
    return res.status(400).json({ error: 'nombre, apellido, documento y curso_id son obligatorios' });
  }

  try {
    const result = await run(
      'INSERT INTO estudiantes (nombre, apellido, documento, curso_id) VALUES (?, ?, ?, ?)',
      [nombre, apellido, documento, curso_id]
    );
    return res.status(201).json({ id: result.id, nombre, apellido, documento, curso_id });
  } catch (error) {
    return res.status(409).json({ error: error.message });
  }
});

module.exports = router;
