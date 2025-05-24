<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "conexion.php"; // Asegúrate de que este archivo contiene tu conexión a la base de datos ($conn)

$sql = "SELECT id, nombre, imagen, descripcion, precio, modelo_3D_GLB, modelo_3D_USDZ, categoria FROM Articulos";
$result = $conn->query($sql);

$articulos = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $articulos[] = $row;
    }
}

echo json_encode($articulos);

$conn->close();
?>