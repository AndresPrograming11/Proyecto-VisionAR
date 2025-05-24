<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once "conexion.php";

$resultado = $conn->query("SELECT * FROM Articulos");
if (!$resultado) {
    echo json_encode(["success" => false, "message" => "Error en la consulta SQL"]);
    exit();
}

$articulos = [];
while ($fila = $resultado->fetch_assoc()) {
    $articulos[] = $fila;
}

echo json_encode($articulos);
$conn->close();
?>
