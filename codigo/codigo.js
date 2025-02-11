/*
  Este archivo es el núcleo de la lógica. 
  Gestiona la creación y eliminación de bloques en una esfera alrededor del jugador, con un sistema de chunks para optimizar la carga de bloques. 
  Incluye un componente de gravedad simple, manejo de eventos de clic (crear/eliminar bloques).
*/

/***********************/
/* PARÁMETROS GLOBALES */
/***********************/
const BOX_SIZE = 1;
let SPHERE_RADIUS = 3;
const GAUSSIAN_SIGMA = 1;
/***********************/
const sceneEl = document.querySelector("a-scene");
const instructionEl = document.getElementById("instruction");
const playerEl = document.querySelector("#player");

/************************/
/* PARÁMETROS DE CHUNKS */
/************************/
const CHUNK_SIZE = 8;
const LOAD_DISTANCE = 2;
let loadedChunks = {};
/************************/

const targetCircle = document.createElement("div");
targetCircle.style.position = "absolute";
targetCircle.style.top = "50%";
targetCircle.style.left = "50%";
targetCircle.style.transform = "translate(-50%, -50%)";
targetCircle.style.border = "2px solid white";
targetCircle.style.borderRadius = "50%";
targetCircle.style.pointerEvents = "none";
document.body.appendChild(targetCircle);

/**
 * Actualiza el tamaño del círculo mirilla
 */
function updateTargetCircle() {
  const circleSize = SPHERE_RADIUS * 200;
  targetCircle.style.width = `${circleSize}px`;
  targetCircle.style.height = `${circleSize}px`;
}

updateTargetCircle();

// Control del tamaño de la mirilla
document.addEventListener("keydown", (event) => {
  if (event.key === "+" || event.key === "Add") {
    // radio máximo de 10
    SPHERE_RADIUS = Math.min(SPHERE_RADIUS + 1, 10);
    updateTargetCircle();
  } else if (event.key === "-" || event.key === "Subtract") {
    // radio mínimo de 1
    SPHERE_RADIUS = Math.max(SPHERE_RADIUS - 1, 1);
    updateTargetCircle();
  }
});

function getChunkCoordinates(x, z) {
  return {
    x: Math.floor(x / (CHUNK_SIZE * BOX_SIZE)),
    z: Math.floor(z / (CHUNK_SIZE * BOX_SIZE)),
  };
}

/**
 * Cargar un chunk
 */
function loadChunk(chunkX, chunkZ) {
  const chunkKey = `${chunkX},${chunkZ}`;
  if (!loadedChunks[chunkKey]) {
    loadedChunks[chunkKey] = true;

    // Consultar si el chunk ya está en memoria
    const chunkBlocks = memoria.filter((block) => {
      const blockChunkX = Math.floor(block.x / CHUNK_SIZE);
      const blockChunkZ = Math.floor(block.z / CHUNK_SIZE);
      return blockChunkX === chunkX && blockChunkZ === chunkZ;
    });

    // Si el chunk existe en memoria, crear los bloques
    if (chunkBlocks.length > 0) {
      chunkBlocks.forEach((block) => {
        createBox(
          `${block.x * BOX_SIZE} ${block.y * BOX_SIZE} ${block.z * BOX_SIZE}`,
          block.id,
          block.mat
        );
      });
    } else {
      // Si el chunk no existe en memoria, generar bloques aleatorios
      for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let z = 0; z < CHUNK_SIZE; z++) {
          const blockX = chunkX * CHUNK_SIZE + x;
          const blockZ = chunkZ * CHUNK_SIZE + z;
          createBox(
            `${blockX * BOX_SIZE} 0 ${blockZ * BOX_SIZE}`,
            memoria.length,
            "white"
          );
          memoria.push({
            id: memoria.length,
            x: blockX,
            y: 0,
            z: blockZ,
            mat: "white",
          });
        }
      }
    }
  }
}

/**
 * Quitar un chunk
 */
function unloadChunk(chunkX, chunkZ) {
  const chunkKey = `${chunkX},${chunkZ}`;
  if (loadedChunks[chunkKey]) {
    loadedChunks[chunkKey] = false;

    // Recoger los bloques en el chunk
    const blocksInChunk = memoria.filter((block) => {
      const blockChunkX = Math.floor(block.x / CHUNK_SIZE);
      const blockChunkZ = Math.floor(block.z / CHUNK_SIZE);
      return blockChunkX === chunkX && blockChunkZ === chunkZ;
    });

    // Quitar los bloques de la escena
    blocksInChunk.forEach((block) => {
      const blockId = `${block.x * BOX_SIZE} ${block.y * BOX_SIZE} ${
        block.z * BOX_SIZE
      }`;
      const blockElement = document.querySelector(
        `[identificador="${blockId}"]`
      );
      if (blockElement) {
        blockElement.parentNode.removeChild(blockElement);
      }
    });
  }
}

/**
 * Actualizar los chunks en función de la posición del jugador
 */
function updateChunks(playerPosition) {
  const playerChunk = getChunkCoordinates(playerPosition.x, playerPosition.z);

  // Cargar chunks dentro de la distancia de carga
  for (let dx = -LOAD_DISTANCE; dx <= LOAD_DISTANCE; dx++) {
    for (let dz = -LOAD_DISTANCE; dz <= LOAD_DISTANCE; dz++) {
      const chunkX = playerChunk.x + dx;
      const chunkZ = playerChunk.z + dz;
      loadChunk(chunkX, chunkZ);
    }
  }

  // Quitar chunks fuera de la distancia de carga
  for (const chunkKey in loadedChunks) {
    if (loadedChunks[chunkKey]) {
      const [chunkX, chunkZ] = chunkKey.split(",").map(Number);
      if (
        Math.abs(chunkX - playerChunk.x) > LOAD_DISTANCE ||
        Math.abs(chunkZ - playerChunk.z) > LOAD_DISTANCE
      ) {
        unloadChunk(chunkX, chunkZ);
      }
    }
  }
}

function gaussian(x, y, z, sigma) {
  const exponent = -(x * x + y * y + z * z) / (2 * sigma * sigma);
  return Math.exp(exponent);
}

// SISTEMA BÁSICO DE GRAVEDAD
AFRAME.registerComponent("simple-gravity", {
  schema: {
    enabled: { default: true },
    gravity: { type: "number", default: -9.8 },
    raycastLength: { type: "number", default: 2 },
    groundThreshold: { type: "number", default: 1.01 },
    smoothingFactor: { type: "number", default: 0.1 },
    jumpStrength: { type: "number", default: 5 }, // Fuerza del salto
  },
  init: function () {
    this.velocityY = 0;
    this.direction = new THREE.Vector3(0, -1, 0);
    this.raycaster = new THREE.Raycaster();
    this.isGrounded = false;
    this.targetY = this.el.object3D.position.y; // Target Y position for smoothing

    // Escuchar el evento de tecla presionada para el salto
    this.onKeyDown = this.onKeyDown.bind(this);
    document.addEventListener("keydown", this.onKeyDown);
  },
  onKeyDown: function (event) {
    // Saltar si se presiona la barra espaciadora y el personaje está en el suelo
    if (event.code === "Space" && this.isGrounded) {
      console.log("eee");
      this.velocityY = this.data.jumpStrength; // Aplicar fuerza de salto
      this.isGrounded = false; // El personaje ya no está en el suelo
    }
  },
  tick: function (time, timeDelta) {
    if (!this.data.enabled) return;

    const delta = timeDelta / 1000; // Convertir a segundos
    const el = this.el;
    const pos = el.object3D.position;

    // Aplicar gravedad
    this.velocityY += this.data.gravity * delta;

    // Actualizar la posición en Y
    pos.y += this.velocityY * delta;

    // Detectar colisión con el suelo
    const origin = new THREE.Vector3(pos.x, pos.y, pos.z);
    this.raycaster.set(origin, this.direction);
    const clickableEls = document.querySelectorAll(".clickable");
    const meshList = [];
    clickableEls.forEach((cEl) => {
      cEl.object3D.traverse(function (obj) {
        if (obj.isMesh) meshList.push(obj);
      });
    });

    const intersects = this.raycaster.intersectObjects(meshList, true);
    let groundDist = intersects.length > 0 ? intersects[0].distance : Infinity;

    if (groundDist < this.data.groundThreshold && groundDist !== 0) {
      // El personaje está en el suelo
      this.isGrounded = true;
      this.velocityY = 0; // Detener el movimiento vertical
      pos.y = intersects[0].point.y + this.data.groundThreshold; // Ajustar la posición al suelo
    } else {
      // El personaje está en el aire
      this.isGrounded = false;
    }

    // Actualizar chunks según la posición del jugador
    updateChunks(pos);
  },
  remove: function () {
    // Limpiar el evento de tecla presionada al eliminar el componente
    document.removeEventListener("keydown", this.onKeyDown);
  },
});

/**
 * Crear bloques
 */
function createBox(position, id, material) {
  const caja = document.createElement("a-box");
  caja.setAttribute("position", position);
  caja.setAttribute("mixin", "mat" + material);
  caja.setAttribute("class", "clickable");
  caja.setAttribute("depth", BOX_SIZE);
  caja.setAttribute("height", BOX_SIZE);
  caja.setAttribute("width", BOX_SIZE);
  caja.setAttribute("identificador", `${position}`);
  caja.setAttribute("shadow", "cast: true; receive: true");

  // Acciones al hacer clic
  caja.addEventListener("click", function (evt) {
    const mouseEvent = evt.detail.mouseEvent;
    if (!mouseEvent) return;

    // Clic izquierdo -> eliminar bloque
    if (mouseEvent.button === 0) {
      removeSphereOfBoxes(evt.detail.intersection.point);
    }
    // Clic derecho -> crear bloque
    else if (mouseEvent.button === 2) {
      createSphereOfBoxes(
        evt.detail.intersection.point,
        elementos[repositorioactivo].style.background
      );
    }
  });

  sceneEl.appendChild(caja);
}

/**
 * Crea una esfera de bloques alrededor de un punto
 */
function createSphereOfBoxes(centerPoint, material) {
  for (let dx = -SPHERE_RADIUS; dx <= SPHERE_RADIUS; dx++) {
    for (let dy = -SPHERE_RADIUS; dy <= SPHERE_RADIUS; dy++) {
      for (let dz = -SPHERE_RADIUS; dz <= SPHERE_RADIUS; dz++) {
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Salta los puntos fuera de la esfera
        if (distance > SPHERE_RADIUS) continue;

        const newPos = {
          x: Math.round(centerPoint.x / BOX_SIZE) * BOX_SIZE + dx * BOX_SIZE,
          y: Math.round(centerPoint.y / BOX_SIZE) * BOX_SIZE + dy * BOX_SIZE,
          z: Math.round(centerPoint.z / BOX_SIZE) * BOX_SIZE + dz * BOX_SIZE,
        };

        // Mirar si ya existe un bloque en esa posición
        const blockId = `${newPos.x} ${newPos.y} ${newPos.z}`;
        const existingBlock = document.querySelector(
          `[identificador="${blockId}"]`
        );
        if (existingBlock) continue;

        // Si no existe, crear un bloque
        createBox(
          `${newPos.x} ${newPos.y} ${newPos.z}`,
          memoria.length,
          material
        );

        // Guardar en memoria
        memoria.push({
          id: memoria.length,
          x: newPos.x / BOX_SIZE,
          y: newPos.y / BOX_SIZE,
          z: newPos.z / BOX_SIZE,
          mat: material,
        });
        localStorage.setItem("memoria", JSON.stringify(memoria));
      }
    }
  }
}

/**
 * Elimina una esfera de bloques alrededor de un punto
 */
function removeSphereOfBoxes(centerPoint) {
  for (let dx = -SPHERE_RADIUS; dx <= SPHERE_RADIUS; dx++) {
    for (let dy = -SPHERE_RADIUS; dy <= SPHERE_RADIUS; dy++) {
      for (let dz = -SPHERE_RADIUS; dz <= SPHERE_RADIUS; dz++) {
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Salta los puntos fuera de la esfera
        if (distance > SPHERE_RADIUS) continue;

        const newPos = {
          x: Math.round(centerPoint.x / BOX_SIZE) * BOX_SIZE + dx * BOX_SIZE,
          y: Math.round(centerPoint.y / BOX_SIZE) * BOX_SIZE + dy * BOX_SIZE,
          z: Math.round(centerPoint.z / BOX_SIZE) * BOX_SIZE + dz * BOX_SIZE,
        };

        // Buscar y eliminar el bloque
        const blockId = `${newPos.x} ${newPos.y} ${newPos.z}`;
        const blockElement = document.querySelector(
          `[identificador="${blockId}"]`
        );
        if (blockElement) {
          blockElement.parentNode.removeChild(blockElement);

          // Borrar de la memoria
          memoria = memoria.filter((block) => {
            const blockPos = `${block.x * BOX_SIZE} ${block.y * BOX_SIZE} ${
              block.z * BOX_SIZE
            }`;
            return blockPos !== blockId;
          });
          localStorage.setItem("memoria", JSON.stringify(memoria));
        }
      }
    }
  }
}

// Inizializar la memoria
if (null == localStorage.getItem("memoria")) {
  console.log("Inicializando memoria...");
  const gridSize = 5;
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
} else {
  console.log("Cargando memoria...");
  memoria = JSON.parse(localStorage.getItem("memoria"));
}

// Guardar la memoria
localStorage.setItem("memoria", JSON.stringify(memoria));

// Crear los bloques de la memoria
memoria.forEach(function (celda, index) {
  createBox(
    `${celda.x * BOX_SIZE} ${celda.y * BOX_SIZE} ${celda.z * BOX_SIZE}`,
    celda.id,
    celda.mat
  );
});

// Quitar la pantalla de pausa al hacer clic
playerEl.addEventListener("click", function () {
  instructionEl.classList.add("hidden");
  document.querySelector("header").style.display = "none"; // Ocultar el header al empezar
  document.querySelector("#repositorio").style.display = "block"; // Mostrar el repositorio al empezar
});

// Poner pantalla de pausa al sacar el cursor
document.addEventListener("pointerlockchange", function () {
  if (document.pointerLockElement === sceneEl.canvas) {
    document.querySelector("header").style.display = "none"; // Ocultar el header cuando el cursor está bloqueado
    document.querySelector("#repositorio").style.display = "block"; // Mostrar el repositorio cuando el cursor está bloqueado
  } else {
    instructionEl.classList.remove("hidden");
    document.querySelector("header").style.display = "flex"; // Mostrar el header cuando el cursor no está bloqueado
    document.querySelector("#repositorio").style.display = "none"; // Ocultar el repositorio cuando el cursor no está bloqueado
  }
});

// Detectar la tecla Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    instructionEl.classList.remove("hidden");
    document.querySelector("header").style.display = "flex"; // Mostrar el header al presionar Escape
    document.querySelector("#repositorio").style.display = "none"; // Ocultar el repositorio al presionar Escape
  }
});

// Pantalla de inicio
instructionEl.addEventListener("click", function () {
  instructionEl.classList.add("hidden");
  sceneEl.canvas.requestPointerLock();
  document.querySelector("header").style.display = "none"; // Ocultar el header al hacer clic para empezar
  document.querySelector("#repositorio").style.display = "block"; // Mostrar el repositorio al empezar
});
