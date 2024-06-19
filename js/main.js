document.addEventListener('DOMContentLoaded', () => {
  // Función que se ejecuta cuando se carga el DOM
  loaded();
});

function loaded() {
  // Obtener referencias a los elementos del formulario y mensajes de error
  const formulario = document.getElementById('formulario');
  const name = document.getElementById('name');
  const apellido = document.getElementById('apellido');
  const email = document.getElementById('email');
  const password = document.getElementById('contraseña');
  const conf_password = document.getElementById('contraseña-confirmar');
  const personaje_favorito = document.getElementById('personaje-favorito');
  const errPersonaje = document.getElementById('error-personaje-favorito');
  const otroPersonaje = document.getElementById('otro-personaje');
  const successMessage = document.getElementById('success-message');
  const errorName = document.getElementById('error-name');
  const errorApellido = document.getElementById('error-apellido');
  const errorEmail = document.getElementById('error-email');
  const errorPassword = document.getElementById('error-password');
  const errorConfPassword = document.getElementById('error-conf-password');

  // Listener para el formulario
  formulario.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar envío por defecto del formulario

    // Resetear mensajes de error y éxito
    errorName.textContent = '';
    errorApellido.textContent = '';
    errorEmail.textContent = '';
    errorPassword.textContent = '';
    errorConfPassword.textContent = '';
    errPersonaje.textContent = '';
    successMessage.textContent = '';

    // Validación de campos
    let valid = true;

    if (name.value.trim() === '') {
      errorName.textContent = 'Nombre requerido';
      name.focus();
      valid = false;
    }

    if (apellido.value.trim() === '') {
      errorApellido.textContent = 'Apellido requerido';
      apellido.focus();
      valid = false;
    }

    if (email.value.trim() === '') {
      errorEmail.textContent = 'Email requerido';
      email.focus();
      valid = false;
    }

    if (password.value.trim() === '') {
      errorPassword.textContent = 'Contraseña requerida';
      password.focus();
      valid = false;
    }

    if (conf_password.value.trim() === '') {
      errorConfPassword.textContent = 'Confirmar contraseña requerida';
      conf_password.focus();
      valid = false;
    } else if (password.value !== conf_password.value) {
      errorConfPassword.textContent = 'Las contraseñas no coinciden';
      conf_password.focus();
      valid = false;
    }

    if (personaje_favorito.value === '--Seleccione una opción--') {
      errPersonaje.textContent = 'Personaje favorito requerido';
      personaje_favorito.focus();
      valid = false;
    }

    if (personaje_favorito.value === 'Otros' && otroPersonaje.value.trim() === '') {
      errPersonaje.textContent = 'Por favor ingrese otro personaje';
      otroPersonaje.focus();
      valid = false;
    }

    if (!valid) {
      return;
    }

    // Preparar datos para enviar al servidor
    let personajeSeleccionado = personaje_favorito.value;
    if (personaje_favorito.value === 'Otros') {
      personajeSeleccionado = otroPersonaje.value.trim();
    }

    const datos = {
      nombre: name.value.trim() + ' ' + apellido.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
      personaje_favorito: personajeSeleccionado,
    };

    try {
      // Simulación de procesamiento del servidor con un delay de 2 segundos
      const respuesta = await fetch('https://productos-d4a40-default-rtdb.firebaseio.com/collection.json', {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!respuesta.ok) {
        throw new Error('Error al enviar los datos al servidor');
      }

      // Mostrar mensaje de éxito
      successMessage.textContent = 'Registro exitoso!';
      alert('¡Registro exitoso!');

      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        formulario.reset(); // Resetear formulario
        successMessage.textContent = ''; // Limpiar mensaje de éxito
        otroPersonaje.style.display = 'none'; // Ocultar campo 'otroPersonaje' si estaba visible
        obtenerDatos(); // Actualizar datos mostrados en la tabla
      }, 2000);
    } catch (error) {
      console.error('Error en la petición fetch:', error);
      alert('Ocurrió un error al procesar su solicitud.');
    }
  });

  // Mostrar u ocultar campo 'otroPersonaje' según selección en 'personaje_favorito'
  document.getElementById('personaje-favorito').addEventListener('change', function () {
    const otroPersonaje = document.getElementById('otro-personaje');
    if (this.value === 'Otros') {
      otroPersonaje.style.display = 'block';
    } else {
      otroPersonaje.style.display = 'none';
    }
  });

  // Obtener y procesar datos al cargar la página
  obtenerDatos();
}

// Función asincrónica para obtener datos del servidor y procesarlos
async function obtenerDatos() {
  const url = 'https://productos-d4a40-default-rtdb.firebaseio.com/collection.json';
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error('Error al obtener los datos del servidor');
    }
    const datos = await respuesta.json();
    console.log(datos); // Procesar o mostrar los datos obtenidos
    procesarDatos(datos);
  } catch (error) {
    console.error('Error en la petición fetch:', error);
    alert('Ocurrió un error al obtener los datos.');
  }
}

// Función para procesar datos y generar filas de la tabla
function procesarDatos(datos) {
  const tablebody = document.getElementById('tablebody');
  const counts = {};

  // Usar map para procesar los datos y contar los personajes favoritos
  Object.values(datos).forEach((entry) => {
    if (entry.personaje_favorito) {
      counts[entry.personaje_favorito] = (counts[entry.personaje_favorito] || 0) + 1;
    }
  });

  // Crear las filas de la tabla usando los datos procesados
  const rows = Object.keys(counts).map(
    (personaje) => `
      <tr>
          <td>${personaje}</td>
          <td>${counts[personaje]}</td>
      </tr>
  `
  );

  // Insertar las filas en el tbody de la tabla
  tablebody.innerHTML = rows.join('');
}
