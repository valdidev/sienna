/*
  Este archivo gestiona las acciones de guardado y carga de datos en un proyecto interactivo.
  Incluye funciones para:
  1) Guardar los datos del terreno en el servidor mediante una petición fetch.
  2) Exportar los datos a un archivo JSON local.
  3) Importar datos desde un archivo JSON.
  4) Reiniciar el terreno a un estado inicial predeterminado.
*/

// Guardar datos en el servidor
document.querySelector("#guardarServidor").onclick = function () {
  guardarEnServidor();
};

// Exportar datos a un archivo JSON local
document.querySelector("#guardarLocal").onclick = function () {
  exportarMemoria();
};

// Importar datos desde un archivo JSON
document.querySelector("#cargarArchivo").onclick = function () {
  importarMemoria();
};

// Reiniciar el terreno a un estado inicial
document.querySelector("#reiniciarMemoria").onclick = function () {
  reiniciarTerreno();
};

/**
 * Guarda los datos del terreno en el servidor.
 */
function guardarEnServidor() {
  const urlActualiza = `${API_BASE_URL}?router=actualiza`;
  const datos = {
    usuario: localStorage.getItem("siennausuario"),
    terreno: JSON.parse(localStorage.getItem("memoria")),
  };

  fetch(urlActualiza, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((responseData) => {
      console.log("Response:", responseData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/**
 * Exporta los datos de memoria a un archivo JSON local.
 */
function exportarMemoria() {
  const dataStr = JSON.stringify(memoria);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "memoria.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Importa los datos de memoria desde un archivo JSON local.
 */
function importarMemoria() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const newMemoria = JSON.parse(e.target.result);
        actualizarMemoria(newMemoria);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert("Archivo JSON inválido.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

/**
 * Reinicia el terreno a un estado inicial predeterminado.
 */
function reiniciarTerreno() {
  // Limpiar la escena actual
  document.querySelectorAll(".clickable").forEach((el) => el.remove());

  memoria = [];
  /*******************/
  /* tamaño del grid */
  /*******************/
  const gridSize = 2;
  for (let x = -gridSize; x <= gridSize; x++) {
    for (let z = -gridSize; z <= gridSize; z++) {
      for (let y = -4; y <= 0; y++) {
        memoria.push({
          id: memoria.length,
          x: x,
          y: y,
          z: z,
          mat: css3Colors[Math.round(Math.random() * css3Colors.length)],
        });
      }
    }
  }

  // Actualizar localStorage y recrear bloques
  localStorage.setItem("memoria", JSON.stringify(memoria));
  actualizarMemoria(memoria);
}

/**
 * Actualiza la memoria y recrea los bloques en la escena.
 * @param {Array} newMemoria - Nueva memoria con los datos del terreno.
 */
function actualizarMemoria(newMemoria) {
  memoria = newMemoria;
  localStorage.setItem("memoria", JSON.stringify(memoria));

  // Recrear bloques desde la nueva memoria
  memoria.forEach((celda) => {
    createBox(
      `${celda.x * BOX_SIZE} ${celda.y * BOX_SIZE} ${celda.z * BOX_SIZE}`,
      celda.id,
      celda.mat
    );
  });
}
