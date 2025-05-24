<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../config/conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

$nombre = trim($data["nombre"] ?? '');
$correo = trim($data["correo"] ?? '');
$username = trim($data["username"] ?? '');
$password = $data["password"] ?? '';

if (!$nombre || !$correo || !$username || !$password) {
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Correo electrónico inválido."]);
    exit;
}

// Verificar si usuario o correo ya existen
$sql_check = "SELECT id FROM Usuarios WHERE username = ? OR correo = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("ss", $username, $correo);
$stmt_check->execute();
$stmt_check->store_result();
if ($stmt_check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "El usuario o correo ya está registrado."]);
    exit;
}
$stmt_check->close();

$reset_token = bin2hex(random_bytes(16));
$reset_token_expiry = date("Y-m-d H:i:s", strtotime('+1 hour'));
$creado_en = date("Y-m-d H:i:s");

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO Usuarios (nombre, correo, username, password, role, reset_token, reset_token_expiry, creado_en) VALUES (?, ?, ?, ?, 'user', ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $nombre, $correo, $username, $hashedPassword, $reset_token, $reset_token_expiry, $creado_en);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Usuario administrador registrado correctamente.",
        "resetToken" => $reset_token
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al registrar: " . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>
