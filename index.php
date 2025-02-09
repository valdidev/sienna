<!-- Punto de arranque: llamada a los componentes y uso de a-frame -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>valdidev</title>
  <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-physics-system-fork/dist/aframe-physics-system.min.js"></script>
  <style>
    <?php include "estilo/estilo.css" ?>
  </style>
</head>

<body>
  <div id="instruction">Click para empezar!</div>

  <?php include 'componentes/login/login.php'; ?>

  <a-scene shadow="type: pcfsoft" physics="gravity: -9.8;">
    <a-assets>
      <a-mixin
        id="material1"
        material="src: img/bloque-gris.jpg; color: #ffcccc;"></a-mixin>
      <a-mixin
        id="material2"
        material="src: img/bloque-gris.jpg; color: #ccffcc;"></a-mixin>
      <a-mixin
        id="material3"
        material="src: img/bloque-gris.jpg; color: #ccccff;"></a-mixin>
    </a-assets>

    <a-sky color="#ECECEC"></a-sky>

    <a-entity
      light="type: directional; intensity: 1; castShadow: true"
      position="10 15 10"></a-entity>

    <a-entity light="type: ambient; intensity: 0.3"></a-entity>

    <a-entity
      id="player"
      dynamic-body="mass: 5; shape: box;"
      position="0 1 0"
      wasd-controls
      look-controls>
      <a-entity id="camera" camera>
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
    <?php include "codigo/codigo.js" ?>
  </script>
  <?php include 'componentes/guardar/guardar.php'; ?>

</body>

</html>