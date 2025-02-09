<div id="login">
    <h1>valdidev</h1>
    <div id="contienelogin">
        <h3>Bienvenido</h3>
        <input type="text" id="usuario" />
        <input type="password" id="contrasena" />
        <button id="iniciarsesion">Iniciar sesión</button>
    </div>
    <?php include "componentes/registro/registro.php"; ?>
    <p id="muestraregistro">¿No tienes usuario todavía? Pulsa aquí</p>
</div>

<style>
    <?php include "login.css"; ?>
</style>
<script>
    <?php include "login.js"; ?>
</script>