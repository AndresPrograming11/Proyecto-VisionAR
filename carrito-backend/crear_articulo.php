<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "conexion.php";

$nombre = $_POST['nombre'] ?? '';
$precio = $_POST['precio'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$categoria = $_POST['categoria'] ?? '';

// Manejo de archivos
function guardarArchivo($campo, $carpeta) {
    if (isset($_FILES[$campo]) && $_FILES[$campo]['error'] === 0) {
        $nombreArchivo = uniqid() . '_' . basename($_FILES[$campo]["name"]);
        $rutaDestino = "uploads/" . $nombreArchivo;
        move_uploaded_file($_FILES[$campo]["tmp_name"], $rutaDestino);
        return $rutaDestino;
    }
    return null;
}

$imagen = guardarArchivo("imagen", "uploads");
$modeloGLB = guardarArchivo("modeloGLB", "uploads");
$modeloUSDZ = guardarArchivo("modeloUSDZ", "uploads");

$sql = "INSERT INTO Articulos (nombre, precio, descripcion, categoria, imagen, modelo_3D_GLB, modelo_3D_USDZ)
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sdsssss", $nombre, $precio, $descripcion, $categoria, $imagen, $modeloGLB, $modeloUSDZ);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Artículo creado exitosamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al insertar el artículo."]);
}


$stmt->close();
$conn->close();