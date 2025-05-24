<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "conexion.php";

$response = [];

$sql = "SELECT id, nombre, imagen, descripcion, precio, modelo_3D_GLB, modelo_3D_USDZ, categoria FROM Articulos";
$result = $conn->query($sql);

if ($result === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error en la consulta: " . $conn->error]);
    exit;
}

$articulos = [];

while ($row = $result->fetch_assoc()) {
    $articulos[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $articulos
]);

$conn->close();
?>
