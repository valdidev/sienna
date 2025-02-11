<?php
/* 
	Este archivo PHP define la interfaz de usuario para gestionar el guardado y la carga de datos en el proyecto. 
*/
?>
<header>
  <h1>
    <img src="sienna.png" alt="Icono">
  </h1>
  <div id="botonera">
    <button id="guardarServidor">Guardar en servidor</button>
    <button id="guardarLocal">Guardar en local</button>
    <button id="cargarArchivo">Cargar archivo</button>
    <button id="reiniciarMemoria">Reiniciar</button>
  </div>
</header>

<style>
	<?php include "guardar.css"; ?>
</style>
<script>
	<?php include "guardar.js"; ?>
</script>