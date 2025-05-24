<?php

// Muy importante: esto carga las clases de PHPMailer

require_once '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Habilitar la visualización de errores (solo para desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../config/conexion.php'; // Asegúrate de que la conexión esté incluida

function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['email']) || !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Correo inválido.']);
    exit;
}

$email = $input['email'];

// Verificar si el correo existe en la base de datos
$sql = "SELECT id, nombre FROM Usuarios WHERE correo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Por seguridad no confirmamos existencia de correo
    echo json_encode(['message' => 'Si el correo existe, recibirás un email para restablecer la contraseña.']);
    exit;
}

$user = $result->fetch_assoc();

// Generar token y establecer fecha de expiración (1 hora)
$token = generateToken(16);
$expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

// Guardar token y expiración en la base de datos
$sql_update = "UPDATE Usuarios SET reset_token = ?, reset_token_expiry = ? WHERE id = ?";
$stmt_update = $conn->prepare($sql_update);
$stmt_update->bind_param("ssi", $token, $expiry, $user['id']);
$stmt_update->execute();
$stmt_update->close();

// Construir enlace para restablecer contraseña
$resetLink = "Tu token es :" . urlencode($token);

// Preparar correo (asegúrate de que PHPMailer esté configurado correctamente)
$mail = new PHPMailer(true);
try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'carlls01w@gmail.com';
    $mail->Password   =  'jlxbqzlafagqepyb';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       ='587' ;

    // Remitente y destinatario
    $mail->setFrom('no-reply@tu-dominio.com', 'Carrito Compras');
    $mail->addAddress($email, $user['nombre']);

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Restablece tu contraseña';
    $mail->Body    = "
        <p>Hola <b>" . htmlspecialchars($user['nombre']) . "</b>,</p>
        <p>Haz solicitado restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <p><a href='$resetLink'>$resetLink</a></p>
        <p>Este enlace es válido solo por 1 hora.</p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
    ";

    $mail->send();

    echo json_encode(['message' => 'Se envió un enlace de restablecimiento a tu correo.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error enviando el correo: ' . $mail->ErrorInfo]);
}

$conn->close();
exit();
