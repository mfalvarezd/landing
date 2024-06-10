let loaded = (eventLoaded) => {
  console.log(eventLoaded);

  let formulario = document.getElementById("formulario");
  let name = document.getElementById("name");
  let apellido = document.getElementById("apellido");
  let email = document.getElementById("email");
  let password = document.getElementById("contraseña");
  let conf_password = document.getElementById("contraseña-confirmar");
  let genero = document.getElementById("genero");
  let tipoUsuario = document.getElementById("tipoUsuario");

  let errorName = document.getElementById("error-name");
  let errorApellido = document.getElementById("error-apellido");
  let errorEmail = document.getElementById("error-email");
  let errorPassword = document.getElementById("error-password");
  let errorConfPassword = document.getElementById("error-conf-password");
  let errorGenero = document.getElementById("error-genero");
  let successMessage = document.getElementById("success-message");

  formulario.addEventListener("submit", (eventSubmit) => {
    eventSubmit.preventDefault();

    // Reset error messages
    errorName.textContent = "";
    errorApellido.textContent = "";
    errorEmail.textContent = "";
    errorPassword.textContent = "";
    errorConfPassword.textContent = "";
    errorGenero.textContent = "";
    successMessage.textContent = "";

    let valid = true;

    if (name.value.length === 0) {
      errorName.textContent = "Nombre requerido";
      name.focus();
      valid = false;
    }

    if (apellido.value.length === 0) {
      errorApellido.textContent = "Apellido requerido";
      apellido.focus();
      valid = false;
    }

    if (email.value.length === 0) {
      errorEmail.textContent = "Email requerido";
      email.focus();
      valid = false;
    }

    if (password.value.length === 0) {
      errorPassword.textContent = "Contraseña requerida";
      password.focus();
      valid = false;
    }

    if (conf_password.value.length === 0) {
      errorConfPassword.textContent = "Confirmar contraseña requerida";
      conf_password.focus();
      valid = false;
    } else if (password.value !== conf_password.value) {
      errorConfPassword.textContent = "Las contraseñas no coinciden";
      conf_password.focus();
      valid = false;
    }

    if (genero.value === "--Seleccione una opción--") {
      errorGenero.textContent = "Género requerido";
      genero.focus();
      valid = false;
    }

    if (!valid) return;

    const datos = {
      nombre: name.value + " " + apellido.value,
      email: email.value,
      password: password.value,
      genero: genero.value,
      tipoUsuario: tipoUsuario.value,
    };

    fetch(
      "https://productos-d4a40-default-rtdb.firebaseio.com/collection.json",
      {
        method: "POST",
        body: JSON.stringify(datos),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        console.log(datos); // Imprimir la respuesta del servidor
        successMessage.textContent = "Registro exitoso!";
        alert("¡Registro exitoso!");
        // Redirigir o recargar la página después de 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => console.error(error));
  });

  obtenerDatos();
};

async function obtenerDatos() {
  const url =
    "https://productos-d4a40-default-rtdb.firebaseio.com/collection.json";
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      console.error("Error:", respuesta.status);
      return;
    }
    const datos = await respuesta.json();
    console.log(datos); // Procesar o mostrar los datos obtenidos
    procesarDatos(datos);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}
function procesarDatos(datos) {
  const tablebody = document.getElementById("tablebody");
  const counts = {};

  // Usamos map para procesar los datos y contar los tipos de usuario
  Object.values(datos).map((entry) => {
    if (entry.tipoUsuario) {
      counts[entry.tipoUsuario] = (counts[entry.tipoUsuario] || 0) + 1;
    }
  });

  // Creamos las filas de la tabla usando los datos procesados
  const rows = Object.keys(counts).map(
    (userType) => `
      <tr>
          <td>${userType}</td>
          <td>${counts[userType]}</td>
      </tr>
  `
  );

  // Insertamos las filas en el tbody de la tabla
  tablebody.innerHTML = rows.join("");
}

document.addEventListener("DOMContentLoaded", () => {
  obtenerDatos();
});

window.addEventListener("DOMContentLoaded", loaded);