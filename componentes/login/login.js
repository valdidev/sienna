document.querySelector("#muestraregistro").onclick = function () {
  document.querySelector("#contienelogin").style.display = "none";
  document.querySelector("#contieneregistro").style.display = "block";
}

document.querySelector("#iniciarsesion").onclick = function () {
  const url = "back/sienna.php?router=login";
  const datos = {
    usuario: document.querySelector("#usuario").value,
    contrasena: document.querySelector("#contrasena").value,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      console.log("Response:", responseData);
      if (responseData.resultado == "ok") {
        document.querySelector("#login").style.display = "none";
        localStorage.setItem(
          "sienna_usuario",
          document.querySelector("#usuario").value
        );

        fetch(
          "back/sienna.php?router=cargarterreno&usuario=" +
            document.querySelector("#usuario").value
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (datos) {
            console.log(datos);
          });
      } else {
        window.location = window.location;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
