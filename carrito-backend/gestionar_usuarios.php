<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'UsuarioModel.php';
require_once 'conexion.php';

$model = new UsuarioModel($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $usuarios = $model->listarUsuarios();
        echo json_encode($usuarios);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode($model->crearUsuario($data));
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($model->actualizarUsuario($data));
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $data);
        echo json_encode($model->eliminarUsuario($data['id']));
        break;

        case 'PATCH':
            $data = json_decode(file_get_contents("php://input"), true);   
         echo json_encode($model->cambiarContrasenaConToken($data['token'], $data['nuevaContrasena']));
        break;    
     

    default:
        echo json_encode(["success" => false, "message" => "Método no permitido"]);
        break;
}
?>
