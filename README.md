# Sistema de Notas Escolar (Gratis)

Aplicación web simple para registrar notas escolares, construida con **Flask + SQLite** (100% gratis y fácil de ejecutar localmente).

## 1) Estructura del proyecto

```text
sistema-notas-escolar/
├── app.py                 # Lógica principal (rutas y CRUD)
├── schema.sql             # Esquema de base de datos SQLite
├── requirements.txt       # Dependencias Python
├── school.db              # Base de datos (se crea automáticamente)
├── static/
│   └── styles.css         # Estilos simples y modernos
└── templates/
    ├── base.html
    ├── index.html
    ├── teachers.html
    ├── courses.html
    ├── assignments.html
    ├── students.html
    └── grades.html
```

## 2) Base de datos

El sistema usa SQLite con estas entidades:

- `teachers`: docentes
- `courses`: cursos
- `subjects`: materias
- `course_subject_teachers`: asignación materia + curso + docente
- `students`: estudiantes
- `enrollments`: matrículas de estudiantes por curso
- `grades`: notas por estudiante y asignación

El script completo está en `schema.sql`.

## 3) Primera versión funcional (paso a paso)

### Paso 1: Instalar dependencias

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Paso 2: Ejecutar la aplicación

```bash
python app.py
```

Se iniciará en `http://127.0.0.1:5000`.

### Paso 3: Flujo recomendado de uso

1. Registrar docentes (`/docentes`)
2. Registrar cursos (`/cursos`)
3. Asignar materias a docentes por curso (`/asignaciones`)
4. Registrar estudiantes y matricularlos (`/estudiantes`)
5. Editar notas rápidamente (`/notas`)

## Características incluidas

- ✅ Registro de docentes
- ✅ Registro de cursos
- ✅ Asignación de materias a docentes por curso
- ✅ Registro de estudiantes
- ✅ Edición rápida de notas en tabla
- ✅ Diseño sencillo y moderno (Bootstrap + CSS)
