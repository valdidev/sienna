<?php

/*
    Este script gestiona una base de datos SQLite (sienna.db) con dos tablas:
    - terreno: Almacena coordenadas y materiales asociados a un usuario.
    - usuarios: Almacena credenciales de usuarios.

    Según el parámetro `router`, realiza acciones como actualizar terrenos, 
    verificar logins, cargar datos de terrenos o registrar nuevos usuarios.
    Procesa solicitudes JSON y devuelve respuestas en el mismo formato.
 */

// CONEXIÓN A LA BASE DE DATOS
$db = new SQLite3('sienna.db');

// CREACIÓN DE TABLAS SI NO EXISTEN
// terreno
$db->exec("
    cREATE TABLE IF NOT EXISTS terreno (
        usuario TEXT,
        x TEXT,
        y TEXT,
        z TEXT,
        mat TEXT
    )
");
// usuarios
$db->exec("
    cREATE TABLE IF NOT EXISTS usuarios (
        usuario TEXT,
        contrasena TEXT
    )
");

// ENRUTAMIENTO DE SOLICITUDES
$router = $_GET['router'] ?? '';
switch ($router) {
    case "actualiza":
        handleUpdateTerrain($db);
        break;
    case "login":
        handleLogin($db);
        break;
    case "cargaterreno":
        handleLoadTerrain($db);
        break;
    case "signup":
        handleSignup($db);
        break;
    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}

$db->close();

/**
 * Actualiza los datos del terreno para un usuario.
 */
function handleUpdateTerrain($db)
{
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);
    $usuario = $data['usuario'] ?? null;
    $terreno = $data['terreno'] ?? null;

    if (!$usuario || !$terreno) {
        echo json_encode(["error" => "Datos incompletos"]);
        return;
    }

    // Eliminar registros existentes del usuario
    $db->exec("dELETE FROM terreno WHERE usuario = '$usuario'");

    // Insertar nuevos registros
    foreach ($terreno as $valor) {
        $sql = "iNSERT INTO terreno VALUES (
            '$usuario',
            '{$valor['x']}',
            '{$valor['y']}',
            '{$valor['z']}',
            '{$valor['mat']}'
        )";
        $db->exec($sql);
    }

    echo json_encode(["respuesta" => "ok"]);
}

/**
 * Verifica las credenciales de un usuario.
 */
function handleLogin($db)
{
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);
    $usuario = $data['usuario'] ?? null;
    $contrasena = $data['contrasena'] ?? null;

    if (!$usuario || !$contrasena) {
        echo json_encode(["error" => "Datos incompletos"]);
        return;
    }

    $sql = "sELECT * FROM usuarios 
            WHERE usuario = '$usuario' 
            AND contrasena = '$contrasena'";
    $result = $db->query($sql);

    if ($result->fetchArray(SQLITE3_ASSOC)) {
        echo json_encode(["resultado" => "ok"]);
    } else {
        echo json_encode(["resultado" => "ko"]);
    }
}

/**
 * Carga los datos del terreno para un usuario.
 */
function handleLoadTerrain($db)
{
    $usuario = $_GET['usuario'] ?? null;

    if (!$usuario) {
        echo json_encode(["error" => "Usuario no proporcionado"]);
        return;
    }

    $sql = "sELECT * FROM terreno WHERE usuario = '$usuario'";
    $result = $db->query($sql);

    $memoria = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $memoria[] = $row;
    }

    echo json_encode($memoria);
}

/**
 * Registra un nuevo usuario.
 */
function handleSignup($db)
{
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);
    $usuario = $data['usuario'] ?? null;
    $contrasena = $data['contrasena'] ?? null;

    if (!$usuario || !$contrasena) {
        echo json_encode(["error" => "Datos incompletos"]);
        return;
    }

    $sql = "iNSERT INTO usuarios VALUES ('$usuario', '$contrasena')";
    $db->exec($sql);

    echo json_encode(["respuesta" => "ok"]);
}

?>