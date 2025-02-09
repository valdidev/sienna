document.querySelector("#crearcuenta").onclick = function () {
  const url = "back/sienna.php?router=registro";
  const datos = {
    usuario: document.querySelector("#nuevousuario").value,
    contrasena: document.querySelector("#nuevacontrasena").value,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((response) => {
      return response.json();
    })
    .then((datos) => {
      console.log(datos);
      if (datos.respuesta == "ok") {
        window.location = window.location;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
