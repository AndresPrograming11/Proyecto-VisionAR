<?php
include_once './conexion.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
function insertarFactura($conn, $factura) {
    $usuario_id = $factura['usuario_id'];
    $fecha = $factura['fecha'];
    $total = $factura['total'];
    $items = json_encode($factura['items'], JSON_UNESCAPED_UNICODE);

    $sql = "INSERT INTO Facturas (usuario_id, fecha, total, items) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isds", $usuario_id, $fecha, $total, $items);

    if ($stmt->execute()) {
        $id = $stmt->insert_id;
        $stmt->close();
        return ["success" => true, "id" => $id];
    } else {
        $error = $stmt->error;
        $stmt->close();
        return ["success" => false, "message" => "Error al insertar la factura: $error"];
    }
}
