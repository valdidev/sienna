<?php
/*
	Este archivo define la interfaz de inicio de sesión y registro de usuarios. 
	Incluye un formulario para iniciar sesión, un enlace para mostrar el formulario de registro, 
	y estilos CSS y funcionalidad JavaScript para gestionar la autenticación y la interacción con el servidor.
*/
?>
<div id="login">
	<img src="sienna.webp">
	<h1>jocarsa | Sienna</h1>
	<div id="contienelogin">
		<h3>Inicia sesión</h3>
		<input type="text" id="usuario">
		<input type="password" id="contrasena">
		<button id="iniciarsesion">Iniciar sesión</button>
	</div>
	<?php include "componentes/signup/signup.php"; ?>
	<p id="muestrasignup">¿No tienes usuario todavía? Pulsa aquí</p>
</div>

<style>
	<?php include "login.css"; ?>
</style>
<script>
	<?php include "login.js"; ?>
</script>