<?php
header('Content-Type: application/json');
require_once 'conexion.php';  // tu conexión mysqli

// Leer JSON recibido
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['usuario_id'], $input['articulo_id'], $input['cantidad'], $input['talla'])) {
    echo json_encode(["success" => false, "message" => "Faltan datos obligatorios"]);
    exit;
}

$usuario_id = (int)$input['usuario_id'];
$articulo_id = (int)$input['articulo_id'];
$cantidad = (int)$input['cantidad'];
$talla = $conn->real_escape_string($input['talla']);

// Validar cantidad
if ($cantidad <= 0) {
    echo json_encode(["success" => false, "message" => "Cantidad inválida"]);
    exit;
}

// Obtener precio_unitario actual del artículo
$sql = "SELECT precio FROM articulos WHERE id = $articulo_id LIMIT 1";
$result = $conn->query($sql);
if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Artículo no encontrado"]);
    exit;
}
$row = $result->fetch_assoc();
$precio_unitario = $row['precio'];

// Insertar en carritoitems
$sqlInsert = "INSERT INTO carritoitems (usuario_id, articulo_id, cantidad, talla, precio_unitario, agregado_en) 
              VALUES ($usuario_id, $articulo_id, $cantidad, '$talla', $precio_unitario, NOW())";

if ($conn->query($sqlInsert)) {
    echo json_encode(["success" => true, "message" => "Artículo agregado al carrito"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al insertar en carrito: " . $conn->error]);
}
$conn->close();
?>
