const STORAGE_KEY = 'school-notes-api-base-url';

const backendForm = document.querySelector('#backend-form');
const backendInput = document.querySelector('#apiBaseUrl');
const backendStatus = document.querySelector('#backend-status');

const teacherForm = document.querySelector('#teacher-form');
const teacherFeedback = document.querySelector('#teacher-feedback');

const studentForm = document.querySelector('#student-form');
const studentFeedback = document.querySelector('#student-feedback');

const refreshCoursesButton = document.querySelector('#refresh-courses');
const coursesList = document.querySelector('#courses-list');
const coursesFeedback = document.querySelector('#courses-feedback');

function getApiBaseUrl() {
  return localStorage.getItem(STORAGE_KEY) || '';
}

function setApiBaseUrl(url) {
  localStorage.setItem(STORAGE_KEY, url);
  updateBackendStatus();
}

function updateBackendStatus() {
  const current = getApiBaseUrl();
  backendInput.value = current;
  backendStatus.textContent = current
    ? `Backend configurado: ${current}`
    : 'No se ha configurado el backend.';
}

function setFeedback(element, message, type = '') {
  element.textContent = message;
  element.classList.remove('success', 'error');
  if (type) element.classList.add(type);
}

async function apiRequest(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error('Configura primero la URL del backend.');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

backendForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = backendInput.value.trim().replace(/\/$/, '');
  setApiBaseUrl(url);
  setFeedback(coursesFeedback, 'URL del backend guardada.', 'success');
  loadCourses();
});

teacherForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(teacherForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    await apiRequest('/teachers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    teacherForm.reset();
    setFeedback(teacherFeedback, 'Docente registrado correctamente.', 'success');
  } catch (error) {
    setFeedback(teacherFeedback, `No se pudo registrar docente: ${error.message}`, 'error');
  }
});

studentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(studentForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    await apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    studentForm.reset();
    setFeedback(studentFeedback, 'Estudiante registrado correctamente.', 'success');
  } catch (error) {
    setFeedback(studentFeedback, `No se pudo registrar estudiante: ${error.message}`, 'error');
  }
});

async function loadCourses() {
  coursesList.innerHTML = '';
  setFeedback(coursesFeedback, 'Cargando cursos...');

  try {
    const courses = await apiRequest('/courses');

    if (!Array.isArray(courses) || courses.length === 0) {
      setFeedback(coursesFeedback, 'No hay cursos registrados.');
      return;
    }

    courses.forEach((course) => {
      const item = document.createElement('li');
      const teacher = course.teacherName || 'Sin docente asignado';
      item.innerHTML = `<strong>${course.name ?? 'Curso sin nombre'}</strong><br><small>Docente: ${teacher}</small>`;
      coursesList.appendChild(item);
    });

    setFeedback(coursesFeedback, 'Cursos cargados correctamente.', 'success');
  } catch (error) {
    setFeedback(coursesFeedback, `No se pudieron cargar los cursos: ${error.message}`, 'error');
  }
}

refreshCoursesButton.addEventListener('click', loadCourses);

updateBackendStatus();
if (getApiBaseUrl()) {
  loadCourses();
}
