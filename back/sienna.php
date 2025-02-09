<?php
/*
	Router para la aplicación Sienna
*/

// CREAR TABLAS SI NO EXISTEN

$db = new SQLite3('sienna.db');

// terreno
$sql = "cREATE TABLE IF NOT EXISTS terreno (
    usuario TEXT,
    x TEXT,
    y TEXT,
    z TEXT,
    mat TEXT
)";

$db->exec($sql);

// usuario
$sql = "cREATE TABLE IF NOT EXISTS usuario (
    usuario TEXT,
    contrasena TEXT
)";
$db->exec($sql);

$router = $_GET['router'];

switch ($router) {
    case "actualizar":
        $rawData = file_get_contents("php://input");
        $data = json_decode($rawData, true);
        $usuario = $data['usuario'] ?? null;
        $terreno = $data['terreno'] ?? null;

        $sql = "dELETE FROM terreno WHERE usuario = '" . $usuario . "'";
        $db->exec($sql);

        foreach ($terreno as $valor) {
            $sql = "iNSERT INTO terreno VALUES(
			'" . $usuario . "',
			'" . $valor['x'] . "',
			'" . $valor['y'] . "',
			'" . $valor['z'] . "',
			'" . $valor['mat'] . "')";
            $db->exec($sql);
        }

        break;
    case "login":
        $rawData = file_get_contents("php://input");
        $data = json_decode($rawData, true);
        $usuario = $data['usuario'] ?? null;
        $contrasena = $data['contrasena'] ?? null;
        $sql = "
			sELECT * FROM usuario
			WHERE usuario = '" . $usuario . "' 
			AND contrasena = '" . $contrasena . "'
		";
        $result = $db->query($sql);
        if ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            echo '{"resultado":"ok"}';
        } else {
            echo '{"resultado":"ko"}';
        }
        break;
    case "cargarterreno":
        $usuario = $_GET['usuario'];
        $sql = "
			sELECT * FROM terreno 
			WHERE usuario = '" . $usuario . "' 
		";
        $memoria = [];
        $result = $db->query($sql);
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $memoria[] = $row;
        }
        echo json_encode($memoria);

        break;
    case "registro":
        $rawData = file_get_contents("php://input");
        $data = json_decode($rawData, true);
        $usuario = $data['usuario'] ?? null;
        $contrasena = $data['contrasena'] ?? null;
        $sql = "iNSERT INTO usuario VALUES(
            '" . $usuario . "',
            '" . $contrasena . "')";

        $db->exec($sql);
        echo '{"respuesta":"ok"}';
        break;
}

$db->close();
