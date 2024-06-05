let loaded = (eventLoaded) => {
  
  console.log(eventLoaded);

  let formulario = document.getElementById("formulario");
  let name = document.getElementById("name");
  let apellido = document.getElementById("apellido");
  let email = document.getElementById("email");
  let password = document.getElementById("contraseña");
  let conf_password = document.getElementById("contraseña-confirma");
  let genero = document.getElementById("genero");
  


  formulario.addEventListener("submit", (eventSubmit) => {
    eventSubmit.preventDefault();

    if (name.value.length == 0) {
      alert("Nombre requerido");
      form_name.focus();
      return;
    }
    const datos = {
      nombre: name.value +" "+apellido.value,
      email: email.value,
      password: password.value
  };

  fetch('https://productos-d4a40-default-rtdb.firebaseio.com/collection.json', {
      method: 'POST',
      body: JSON.stringify(datos),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(respuesta => respuesta.json())
  .then(datos => {
      console.log(datos); // Imprimir la respuesta del servidor
  })
  .catch(error => console.error(error));

    debugger;
  });
};

window.addEventListener("DOMContentLoaded", loaded);
