/* Enviar datos de guardado al backend */
document.querySelector("#guardar").onclick = function () {
  console.log("Guardando...");

  const url = "back/sienna.php?router=actualizar";

  const datos = {
    usuario: localStorage.getItem("sienna_usuario"),
    terreno: JSON.parse(localStorage.getItem("memoria")),
  };

  console.log("Datos:", datos);

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log("Guardado:", data);
    });
};
