const express = require('express');
const { run, all } = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
  const rows = await all(`
    SELECT ad.id, d.nombre AS docente, c.nombre AS curso, m.nombre AS materia
    FROM asignaciones_docentes ad
    JOIN docentes d ON d.id = ad.docente_id
    JOIN cursos c ON c.id = ad.curso_id
    JOIN materias m ON m.id = ad.materia_id
    ORDER BY ad.id DESC
  `);

  res.json(rows);
});

router.post('/', async (req, res) => {
  const { docente_id, curso_id, materia_id } = req.body;
  if (!docente_id || !curso_id || !materia_id) {
    return res.status(400).json({ error: 'docente_id, curso_id y materia_id son obligatorios' });
  }

  try {
    const result = await run(
      'INSERT INTO asignaciones_docentes (docente_id, curso_id, materia_id) VALUES (?, ?, ?)',
      [docente_id, curso_id, materia_id]
    );
    return res.status(201).json({ id: result.id, docente_id, curso_id, materia_id });
  } catch (error) {
    return res.status(409).json({ error: error.message });
  }
});

module.exports = router;
