<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include_once '../Models/FacturaModel.php';
include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (
        isset($input['usuario_id']) &&
        isset($input['fecha']) &&
        isset($input['total']) &&
        isset($input['items'])
    ) {
        $resultado = insertarFactura($conn, $input);
        echo json_encode($resultado);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Faltan datos requeridos"
        ]);
    }

    $conn->close();
} else {
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido"
    ]);
}
