<?php
header('Content-Type: application/json');
include 'conexion.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['token'], $input['newPassword'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos.']);
    exit;
}

$token = $input['token'];
$newPassword = $input['newPassword'];

// Validar longitud y reglas de la contraseña (puedes agregar más validaciones)
if (strlen($newPassword) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres.']);
    exit;
}

// Buscar usuario por token y verificar expiry
$sql = "SELECT id, reset_token_expiry FROM Usuarios WHERE reset_token = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Token inválido o expirado.']);
    exit;
}

$user = $result->fetch_assoc();

if (strtotime($user['reset_token_expiry']) < time()) {
    http_response_code(400);
    echo json_encode(['error' => 'El token ha expirado.']);
    exit;
}

// Hashear la nueva contraseña
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Actualizar la contraseña y eliminar token
$sql_update = "UPDATE Usuarios SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?";
$stmt_update = $conn->prepare($sql_update);
$stmt_update->bind_param("si", $hashedPassword, $user['id']);
if ($stmt_update->execute()) {
    echo json_encode(['message' => 'Contraseña actualizada correctamente.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar la contraseña.']);
}

$stmt_update->close();
$conn->close();
