<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once  '../Models/articuloModel.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Listar artículos
        $articulos = listarArticulos();
        echo json_encode($articulos);
        break;

        case 'POST':
            if (isset($_POST['id'])) {
                // Si hay 'id', asumimos que es una actualización
                $id = intval($_POST['id']);
                $resultado = actualizarArticulo($id, $_POST, $_FILES);
                echo json_encode($resultado);
            } else {
                // Crear nuevo artículo
                $resultado = crearArticulo($_POST, $_FILES);
                echo json_encode($resultado);
            }
            break;

    case 'DELETE':
        // Eliminar artículo por ID
        parse_str(file_get_contents("php://input"), $delete_vars);
        if (isset($delete_vars['id'])) {
            $id = intval($delete_vars['id']);
            $resultado = eliminarArticulo($id);
            echo json_encode($resultado);
        } else {
            echo json_encode(["success" => false, "message" => "ID no proporcionado"]);
        }
        break;

    case 'OPTIONS':
        // Para preflight request CORS
        http_response_code(200);
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método no permitido"]);
        break;
}
?>
