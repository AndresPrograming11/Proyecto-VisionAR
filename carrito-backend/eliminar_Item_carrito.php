<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "conexion.php";

// Obtener el body en formato JSON
$data = json_decode(file_get_contents("php://input"), true);
$item_id = $data["id"] ?? null;

if ($item_id) {
    $sql = "DELETE FROM CarritoItems WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $item_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Item eliminado del carrito"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar el item"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "ID no recibido"]);
}

$conn->close();
?>
