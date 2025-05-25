<?php
require_once '../Models/OrdenModel.php';
require_once '../config/conexion.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class OrdenController {
    private $model;

    public function __construct($conn) {
        $this->model = new OrdenModel($conn);
    }

    public function obtenerOrdenes() {
        $usuarioId = $_GET['usuario_id'] ?? null;

        if ($usuarioId === null) {
            echo json_encode(["success" => false, "message" => "Usuario no autenticado"]);
            exit;
        }

        $ordenes = $this->model->obtenerOrdenesConDetalles($usuarioId);

        echo json_encode([
            'success' => true,
            'data' => $ordenes
        ]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $ordenController = new OrdenController($conn);
    $ordenController->obtenerOrdenes();
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
