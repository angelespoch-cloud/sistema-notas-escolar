# Sistema de Notas Escolar - Estructura Inicial

Este proyecto contiene una base inicial de una aplicación web para registro de notas escolares, separada en frontend y backend.

## 1) Estructura del proyecto

```text
sistema-notas-escolar/
├── backend/
│   ├── database/
│   │   ├── init.js
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── src/
│   │   ├── app.js
│   │   ├── db.js
│   │   └── routes/
│   │       ├── asignaciones.js
│   │       ├── cursos.js
│   │       ├── docentes.js
│   │       └── estudiantes.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── app.js
│   ├── index.html
│   └── styles.css
└── README.md
```

## 2) Archivos iniciales

### Backend
- API REST con Express.
- Rutas para:
  - Registro de docentes.
  - Registro de cursos.
  - Registro de estudiantes.
  - Asignación de materias a docentes por curso.
- Base de datos SQLite inicial (`schema.sql` + `seed.sql`).

### Frontend
- Interfaz HTML inicial con formularios para cada módulo.
- Script JavaScript que consume los endpoints del backend.
- Estilos básicos para una vista funcional.

## 3) Explicación paso a paso

1. Instalar dependencias del backend:
   ```bash
   cd backend
   npm install
   ```

2. Crear base de datos inicial:
   ```bash
   npm run init-db
   ```

3. Levantar servidor:
   ```bash
   npm run dev
   ```

4. Abrir en navegador:
   - URL: `http://localhost:3000`
   - El backend sirve también los archivos del frontend.

5. Probar flujo base:
   - Registrar docentes.
   - Registrar cursos.
   - Registrar estudiantes.
   - Registrar asignaciones de materia por docente y curso.

> Nota: esta es una base inicial pensada para crecer con autenticación, gestión de notas, reportes y control de roles.
