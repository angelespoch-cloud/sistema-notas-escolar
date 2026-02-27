# Sistema de Notas Escolar - Frontend básico

Interfaz frontend inicial para el sistema de notas con:

- Página principal.
- Formulario para registrar docentes.
- Formulario para registrar estudiantes.
- Lista de cursos.
- Conexión al backend existente mediante URL configurable.

## Estructura

- `index.html`: estructura de la interfaz.
- `styles.css`: estilos base de la aplicación.
- `app.js`: lógica de formularios, consumo de API y renderizado de cursos.

## Endpoints esperados del backend

El frontend consume estos endpoints, usando la URL base que ingreses en la interfaz:

- `POST /teachers`
- `POST /students`
- `GET /courses`

Ejemplo de URL base: `http://localhost:3000/api`

## Cómo ejecutar el proyecto paso a paso

1. **Ubícate en la carpeta del proyecto**

   ```bash
   cd /workspace/sistema-notas-escolar
   ```

2. **Asegúrate de tener tu backend ejecutándose**

   Tu backend debe estar activo y exponer los endpoints anteriores.

3. **Levanta un servidor estático para el frontend**

   Con Python 3:

   ```bash
   python3 -m http.server 5173
   ```

4. **Abre el frontend en el navegador**

   Ve a:

   ```
   http://localhost:5173
   ```

5. **Configura la URL del backend desde la interfaz**

   En la sección **Configurar backend**, ingresa la URL base (por ejemplo `http://localhost:3000/api`) y presiona **Guardar URL**.

6. **Prueba las funcionalidades**

   - Registra un docente con el formulario.
   - Registra un estudiante con el formulario.
   - Haz clic en **Actualizar cursos** para cargar la lista de cursos desde el backend.

## Notas

- La URL del backend se guarda en `localStorage` para no tener que ingresarla cada vez.
- Si el backend responde con error o no está disponible, la interfaz mostrará mensajes de error en pantalla.
