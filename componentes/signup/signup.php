<?php
/*
   Este archivo define la interfaz de registro de nuevos usuarios, 
   incluyendo un formulario para ingresar nombre de usuario y contraseña. 
   Integra estilos CSS y funcionalidad JavaScript para enviar los datos de registro al servidor.
*/
?>
<div id="contienesignup">
    <h3>Crea un nuevo usuario</h3>
    <input type="text" id="nuevousuario">
    <input type="password" id="nuevacontrasena">
    <button id="crearusuario">Crea usuario</button>
</div>

<style>
    <?php include "signup.css"; ?>
</style>
<script>
    <?php include "signup.js"; ?>
</script>