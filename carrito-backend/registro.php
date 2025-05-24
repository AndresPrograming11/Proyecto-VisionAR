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

// Hashear la contraseña
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insertar en la base de datos
$sql = "INSERT INTO usuarios (nombre, correo, username, password, role) VALUES (?, ?, ?, ?, 'user')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $nombre, $correo, $username, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario registrado correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar: " . $conn->error]);
}

$stmt->close();
$conn->close();
