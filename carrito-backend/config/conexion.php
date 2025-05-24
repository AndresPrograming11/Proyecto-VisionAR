<?php
$servername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "tienda";

// Crear conexión
$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Error de conexión: " . $conn->connect_error
    ]));
}
?>
