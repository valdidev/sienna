/* 
	Este script gestiona el registro de nuevos usuarios. 
	Envía los datos del formulario de registro al servidor mediante una petición fetch 
	y recarga la página si el registro es exitoso.
*/

document.querySelector("#crearusuario").onclick = function () {
  const urlSignup = `${API_BASE_URL}?router=signup`;
  const datos = {
    usuario: document.querySelector("#nuevousuario").value,
    contrasena: document.querySelector("#nuevacontrasena").value,
  };

  fetch(urlSignup, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (datos) {
      console.log(datos);
      if (datos.respuesta == "ok") {
        window.location = window.location;
      }
    });
};
