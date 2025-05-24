<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../config/conexion.php";

// Obtener datos del formulario
$data = json_decode(file_get_contents("php://input"), true);
$usuario_id = $_POST["usuario_id"] ?? null;
$articulo_id = $_POST["articulo_id"] ?? null;
$cantidad = $_POST["cantidad"] ?? null;
$talla = $_POST["talla"] ?? null;
$precio = $_POST["precio"] ?? null;

// Verificar que los datos sean válidos
if ($usuario_id && $articulo_id && $cantidad && $talla && $precio) {
    $sql = "INSERT INTO CarritoItems (usuario_id, articulo_id, cantidad, talla, precio) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iiisd", $usuario_id, $articulo_id, $cantidad, $talla, $precio);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Artículo agregado al carrito"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al agregar artículo"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}

$conn->close();
?>

