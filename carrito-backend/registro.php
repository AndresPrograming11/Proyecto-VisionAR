<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data["nombre"] ?? '';
$correo = $data["correo"] ?? '';
$username = $data["username"] ?? '';
$password = $data["password"] ?? '';

// Validar campos vacíos
if (!$nombre || !$correo || !$username || !$password) {
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
    exit;
}

// Generar token aleatorio y caducidad (1 hora)
$reset_token        = bin2hex(random_bytes(16)); 
$reset_token_expiry = date("Y-m-d H:i:s", strtotime('+1 hour'));


// Hashear la contraseña
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Preparar INSERT incluyendo token y expiry
$sql = "INSERT INTO Usuarios
          (nombre, correo, username, password, role, reset_token, reset_token_expiry)
        VALUES (?,    ?,      ?,        ?,        'admin', ?,           ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
  "ssssss",
  $nombre,
  $correo,
  $username,
  $hashedPassword,
  $reset_token,
  $reset_token_expiry
);

if ($stmt->execute()) {
    echo json_encode([
      "success"     => true,
      "message"     => "Usuario registrado correctamente.",
      "resetToken"  => $reset_token
    ]);
} else {
    echo json_encode([
      "success" => false,
      "message" => "Error al registrar: " . $conn->error
    ]);
}

$stmt->close();
$conn->close();
