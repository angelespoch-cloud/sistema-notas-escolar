const express = require('express');
const cors = require('cors');
const path = require('path');

const docentesRoutes = require('./routes/docentes');
const cursosRoutes = require('./routes/cursos');
const estudiantesRoutes = require('./routes/estudiantes');
const asignacionesRoutes = require('./routes/asignaciones');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/docentes', docentesRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/asignaciones', asignacionesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
});
