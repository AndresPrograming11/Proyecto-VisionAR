<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../config/conexion.php";

// Obtener los datos JSON enviados
$data = json_decode(file_get_contents("php://input"), true);

$item_id = $data["id"] ?? null;
$nueva_cantidad = $data["cantidad"] ?? null;

if ($item_id && $nueva_cantidad) {
    $sql = "UPDATE CarritoItems SET cantidad = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $nueva_cantidad, $item_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cantidad actualizada"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar cantidad"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}

$conn->close();
?>
