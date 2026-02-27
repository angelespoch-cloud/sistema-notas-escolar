from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Any

from flask import Flask, flash, g, redirect, render_template, request, url_for

BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "school.db"

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev"


def get_db() -> sqlite3.Connection:
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(_: Any) -> None:
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db() -> None:
    schema_path = BASE_DIR / "schema.sql"
    db = sqlite3.connect(DATABASE)
    with schema_path.open("r", encoding="utf-8") as f:
        db.executescript(f.read())
    db.commit()
    db.close()


@app.route("/")
def index() -> str:
    db = get_db()
    stats = {
        "docentes": db.execute("SELECT COUNT(*) FROM teachers").fetchone()[0],
        "cursos": db.execute("SELECT COUNT(*) FROM courses").fetchone()[0],
        "estudiantes": db.execute("SELECT COUNT(*) FROM students").fetchone()[0],
        "asignaciones": db.execute("SELECT COUNT(*) FROM course_subject_teachers").fetchone()[0],
    }
    return render_template("index.html", stats=stats)


@app.route("/docentes", methods=["GET", "POST"])
def teachers() -> str:
    db = get_db()
    if request.method == "POST":
        nombre = request.form["nombre"].strip()
        email = request.form["email"].strip()
        if nombre:
            db.execute(
                "INSERT INTO teachers (name, email) VALUES (?, ?)",
                (nombre, email or None),
            )
            db.commit()
            flash("Docente registrado correctamente.", "success")
        return redirect(url_for("teachers"))

    teachers_list = db.execute(
        "SELECT id, name, email, created_at FROM teachers ORDER BY id DESC"
    ).fetchall()
    return render_template("teachers.html", teachers=teachers_list)


@app.route("/cursos", methods=["GET", "POST"])
def courses() -> str:
    db = get_db()
    if request.method == "POST":
        nombre = request.form["nombre"].strip()
        nivel = request.form["nivel"].strip()
        if nombre:
            db.execute(
                "INSERT INTO courses (name, level) VALUES (?, ?)",
                (nombre, nivel or None),
            )
            db.commit()
            flash("Curso registrado correctamente.", "success")
        return redirect(url_for("courses"))

    courses_list = db.execute(
        "SELECT id, name, level, created_at FROM courses ORDER BY id DESC"
    ).fetchall()
    return render_template("courses.html", courses=courses_list)


@app.route("/estudiantes", methods=["GET", "POST"])
def students() -> str:
    db = get_db()
    if request.method == "POST":
        nombre = request.form["nombre"].strip()
        codigo = request.form["codigo"].strip()
        course_id = request.form.get("course_id", type=int)

        if nombre and codigo and course_id:
            db.execute(
                "INSERT INTO students (full_name, student_code) VALUES (?, ?)",
                (nombre, codigo),
            )
            student_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]
            db.execute(
                "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
                (student_id, course_id),
            )
            db.commit()
            flash("Estudiante registrado y matriculado.", "success")
        else:
            flash("Completa nombre, código y curso.", "warning")
        return redirect(url_for("students"))

    students_list = db.execute(
        """
        SELECT s.id, s.full_name, s.student_code, c.name AS course_name
        FROM students s
        JOIN enrollments e ON e.student_id = s.id
        JOIN courses c ON c.id = e.course_id
        ORDER BY s.id DESC
        """
    ).fetchall()
    courses_list = db.execute("SELECT id, name FROM courses ORDER BY name").fetchall()
    return render_template(
        "students.html", students=students_list, courses=courses_list
    )


@app.route("/asignaciones", methods=["GET", "POST"])
def assignments() -> str:
    db = get_db()
    if request.method == "POST":
        subject_name = request.form["materia"].strip()
        course_id = request.form.get("course_id", type=int)
        teacher_id = request.form.get("teacher_id", type=int)

        if subject_name and course_id and teacher_id:
            db.execute(
                "INSERT INTO subjects (name) VALUES (?)",
                (subject_name,),
            )
            subject_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]
            db.execute(
                """
                INSERT INTO course_subject_teachers (course_id, subject_id, teacher_id)
                VALUES (?, ?, ?)
                """,
                (course_id, subject_id, teacher_id),
            )
            db.commit()
            flash("Materia asignada al docente por curso.", "success")
        else:
            flash("Completa todos los campos de la asignación.", "warning")
        return redirect(url_for("assignments"))

    assignments_list = db.execute(
        """
        SELECT a.id, c.name AS course_name, sb.name AS subject_name, t.name AS teacher_name
        FROM course_subject_teachers a
        JOIN courses c ON c.id = a.course_id
        JOIN subjects sb ON sb.id = a.subject_id
        JOIN teachers t ON t.id = a.teacher_id
        ORDER BY a.id DESC
        """
    ).fetchall()
    teachers_list = db.execute("SELECT id, name FROM teachers ORDER BY name").fetchall()
    courses_list = db.execute("SELECT id, name FROM courses ORDER BY name").fetchall()

    return render_template(
        "assignments.html",
        assignments=assignments_list,
        teachers=teachers_list,
        courses=courses_list,
    )


@app.route("/notas", methods=["GET", "POST"])
def grades() -> str:
    db = get_db()
    assignment_id = request.args.get("assignment_id", type=int)

    if request.method == "POST":
        assignment_id = request.form.get("assignment_id", type=int)
        if assignment_id:
            enrollments = db.execute(
                "SELECT id FROM enrollments WHERE course_id = (SELECT course_id FROM course_subject_teachers WHERE id = ?)",
                (assignment_id,),
            ).fetchall()
            for enrollment in enrollments:
                field = f"grade_{enrollment['id']}"
                raw_grade = request.form.get(field, "").strip()
                if not raw_grade:
                    db.execute(
                        "DELETE FROM grades WHERE enrollment_id = ? AND assignment_id = ?",
                        (enrollment["id"], assignment_id),
                    )
                    continue
                try:
                    grade_value = float(raw_grade)
                except ValueError:
                    continue
                db.execute(
                    """
                    INSERT INTO grades (enrollment_id, assignment_id, grade)
                    VALUES (?, ?, ?)
                    ON CONFLICT(enrollment_id, assignment_id)
                    DO UPDATE SET grade = excluded.grade, updated_at = CURRENT_TIMESTAMP
                    """,
                    (enrollment["id"], assignment_id, grade_value),
                )
            db.commit()
            flash("Notas actualizadas.", "success")
        return redirect(url_for("grades", assignment_id=assignment_id))

    assignments_list = db.execute(
        """
        SELECT a.id, c.name || ' - ' || sb.name || ' (' || t.name || ')' AS label
        FROM course_subject_teachers a
        JOIN courses c ON c.id = a.course_id
        JOIN subjects sb ON sb.id = a.subject_id
        JOIN teachers t ON t.id = a.teacher_id
        ORDER BY c.name, sb.name
        """
    ).fetchall()

    rows = []
    if assignment_id:
        rows = db.execute(
            """
            SELECT e.id AS enrollment_id, s.full_name, s.student_code, g.grade
            FROM enrollments e
            JOIN students s ON s.id = e.student_id
            JOIN course_subject_teachers a ON a.course_id = e.course_id
            LEFT JOIN grades g ON g.enrollment_id = e.id AND g.assignment_id = a.id
            WHERE a.id = ?
            ORDER BY s.full_name
            """,
            (assignment_id,),
        ).fetchall()

    return render_template(
        "grades.html",
        assignments=assignments_list,
        selected_assignment=assignment_id,
        rows=rows,
    )


if __name__ == "__main__":
    if not DATABASE.exists():
        init_db()
    app.run(debug=True)
