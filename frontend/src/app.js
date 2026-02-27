const output = document.getElementById('output');

const sendForm = (formId, endpoint) => {
  const form = document.getElementById(formId);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());

    ['anio', 'curso_id', 'docente_id', 'materia_id'].forEach((field) => {
      if (body[field]) body[field] = Number(body[field]);
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    output.textContent = JSON.stringify(result, null, 2);
    if (response.ok) form.reset();
  });
};

sendForm('form-docentes', '/api/docentes');
sendForm('form-cursos', '/api/cursos');
sendForm('form-estudiantes', '/api/estudiantes');
sendForm('form-asignaciones', '/api/asignaciones');
