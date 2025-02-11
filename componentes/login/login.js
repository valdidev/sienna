/*
  Este script gestiona el inicio de sesión y registro de usuarios.
  Incluye funciones para:
  1) Mostrar el formulario de registro.
  2) Enviar credenciales de inicio de sesión al servidor mediante fetch.
  3) Cargar los datos del terreno asociados al usuario si el inicio de sesión es exitoso.
*/

// Mostrar el formulario de registro
document.querySelector("#muestrasignup").onclick = function () {
  document.querySelector("#contienelogin").style.display = "none";
  document.querySelector("#contienesignup").style.display = "block";
};

// Manejar el inicio de sesión
document.querySelector("#iniciarsesion").onclick = function () {
  const usuario = document.querySelector("#usuario").value;
  const contrasena = document.querySelector("#contrasena").value;

  if (!usuario || !contrasena) {
    alert("Por favor, ingresa usuario y contraseña.");
    return;
  }

  iniciarSesion(usuario, contrasena);
};

/**
 * Función para iniciar sesión.
 * @param {string} usuario - Nombre de usuario.
 * @param {string} contrasena - Contraseña del usuario.
 */
function iniciarSesion(usuario, contrasena) {
  const urlLogin = `${API_BASE_URL}?router=login`;
  const datos = { usuario, contrasena };

  fetch(urlLogin, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then(handleResponse)
    .then((responseData) => {
      if (responseData.resultado === "ok") {
        onLoginSuccess(usuario);
      } else {
        window.location.reload(); // Recargar la página si el login falla
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al iniciar sesión. Inténtalo de nuevo.");
    });
}

/**
 * Maneja la respuesta del servidor.
 * @param {Response} response - Respuesta del servidor.
 * @returns {Promise<object>} - Datos JSON de la respuesta.
 */
function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

/**
 * Acciones a realizar cuando el inicio de sesión es exitoso.
 * @param {string} usuario - Nombre de usuario.
 */
function onLoginSuccess(usuario) {
  document.querySelector("#login").style.display = "none";
  localStorage.setItem("siennausuario", usuario);
  cargarTerreno(usuario);

  // Habilitar los controles ante login exitoso
  const player = document.querySelector("#player");
  player.setAttribute("wasd-controls", "enabled", true);
}

/**
 * Carga los datos del terreno asociados al usuario.
 * @param {string} usuario - Nombre de usuario.
 */
function cargarTerreno(usuario) {
  const urlCargaTerreno = `${API_BASE_URL}?router=cargaterreno&usuario=${usuario}`;

  fetch(urlCargaTerreno)
    .then(handleResponse)
    .then((datos) => {
      console.log("Datos del terreno cargados:", datos);
      memoria = datos;
    })
    .catch((error) => {
      console.error("Error al cargar el terreno:", error);
    });
}
