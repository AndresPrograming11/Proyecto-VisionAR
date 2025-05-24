<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once "conexion.php";

$usuario_id = $_GET["usuario_id"] ?? null;

if ($usuario_id) {
    $sql = "SELECT * FROM CarritoItems WHERE usuario_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $carrito = [];
    while ($row = $result->fetch_assoc()) {
        $carrito[] = $row;
    }

    echo json_encode($carrito);
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Usuario no proporcionado"]);
}

$conn->close();
?>
