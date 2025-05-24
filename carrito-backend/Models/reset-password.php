<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PATCH, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['token']) || !isset($input['nuevaContrasena'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos necesarios']);
    exit();
}

$token = $input['token'];
$nuevaContrasena = $input['nuevaContrasena'];

$conn = new mysqli("localhost", "usuario", "password", "basededatos");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit();
}

// Consulta que valida token y que no haya expirado
$stmt = $conn->prepare("
    SELECT id
    FROM Usuarios
    WHERE reset_token = ? AND reset_token_expiry > NOW()
");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Token inválido o expirado']);
    exit();
}

$usuario = $result->fetch_assoc();
$id_usuario = $usuario['id'];

// Hashea la nueva contraseña
$passwordHash = password_hash($nuevaContrasena, PASSWORD_DEFAULT);

// Actualiza la contraseña y elimina el token para no reutilizarlo
$stmt = $conn->prepare("UPDATE Usuarios SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?");
$stmt->bind_param("si", $passwordHash, $id_usuario);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Contraseña actualizada correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar la contraseña']);
}

$stmt->close();
$conn->close();
?>