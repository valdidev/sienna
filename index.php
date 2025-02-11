<?php
/* 
    Este archivo es el punto de entrada, un entorno 3D interactivo construido con A-Frame. 
    Incluye un sistema de inicio de sesión, un mundo 3D con iluminación, cielo dinámico y física básica, 
    y componentes para guardar/cargar datos y seleccionar colores. 
    También integra scripts y estilos para la interacción y personalización del entorno.
*/
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>jocarsa | sienna</title>
  <!-- cargo archivo configuración -->
  <script src="codigo/config.js"></script>
  <!-- cargo librerías -->
  <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
  <script src="lib/colores.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/aframe-instanced-mesh@0.5.0/dist/aframe-instanced-mesh.min.js"></script>

  <script>
    window.addEventListener("contextmenu", function(e) {
      e.preventDefault();
    });
  </script>

  <style>
    <?php include "estilo/estilo.css" ?>
  </style>
</head>

<body>
  <div id="instruction">Click para empezar</div>

  <?php include "componentes/login/login.php"; ?>

  <!-- Escena principal -->
  <a-scene
    shadow="type: pcfsoft"
    physics="gravity: -9.8;"
    fog="type: linear; color: #ffffff; near: 10; far: 50">

    <!-- Assets -->
    <a-assets>
      <?php
      include "lib/colores.php";

      // Genera mixins de materiales para cada color definido
      foreach ($css3_colors as $color) {
        echo '
      			<a-mixin
		       id="mat' . $color . '"
		       material="src: img/bloque.jpg; color: ' . $color . ';"
		     ></a-mixin>
      		';
      }
      ?>

      <!-- Imagen de fondo para el cielo -->
      <img id="cielo" src="img/cielo.jpg">
    </a-assets>

    <!-- Skybox que usa la imagen del cielo como fondo -->
    <a-sky src="#cielo" material="fog: false;"></a-sky>

    <!-- Luz direccional -->
    <a-entity
      light="type: directional; intensity: 1; castShadow: true"
      position="10 15 10"></a-entity>

    <!-- Luz ambiental -->
    <a-entity
      light="type: ambient; intensity: 0.3"></a-entity>

    <!-- Entidad jugador -->
    <a-entity
      id="player"
      position="0 1 0"
      wasd-controls
      look-controls="pointerLockEnabled: true"
      simple-gravity>

      <!-- Cámara que sigue al jugador -->
      <a-entity id="camera" camera>
        <!-- Cursor personalizado para interacciones -->
        <a-cursor
          id="cursor"
          fuse="false"
          raycaster="objects: .clickable"
          material="color: black; shader: flat"
          geometry="primitive: ring; radiusInner: 0.005; radiusOuter: 0.01"></a-cursor>
      </a-entity>
    </a-entity>
  </a-scene>

  <script>
    <?php include "codigo/codigo.js"; ?>
  </script>

  <?php include "componentes/guardar/guardar.php"; ?>
  <?php include "componentes/repositorio/repositorio.php"; ?>
</body>

</html>