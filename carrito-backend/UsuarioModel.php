<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
class UsuarioModel {
    
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function listarUsuarios() {
        $stmt = $this->conn->prepare("SELECT id, nombre, correo, username, role FROM Usuarios");
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function crearUsuario($data) {
        // Validación de campos requeridos
        if (
            !isset($data['nombre']) ||
            !isset($data['correo']) ||
            !isset($data['username']) ||
            !isset($data['role']) ||
            !isset($data['password']) // ✅ Aquí debe ser 'password', no 'contrasena'
        ) {
            return ["success" => false, "message" => "Faltan datos para crear el usuario."];
        }

        $nombre = $data['nombre'];
        $correo = $data['correo'];
        $username = $data['username'];
        $role = $data['role'];
        $password = password_hash($data['password'], PASSWORD_DEFAULT); // ✅ Hashea correctamente

        $stmt = $this->conn->prepare("INSERT INTO Usuarios (nombre, correo, username, role, password) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $nombre, $correo, $username, $role, $password);

        if ($stmt->execute()) {
            return ["success" => true, "message" => "Usuario creado correctamente."];
        } else {
            return ["success" => false, "message" => "Error al crear el usuario: " . $this->conn->error];
        }
    }

    public function actualizarUsuario($data) {
        if (
            !isset($data['id']) ||
            !isset($data['nombre']) ||
            !isset($data['correo']) ||
            !isset($data['username']) ||
            !isset($data['role'])
        ) {
            return ["success" => false, "message" => "Faltan datos para actualizar el usuario."];
        }

        $id = $data['id'];
        $nombre = $data['nombre'];
        $correo = $data['correo'];
        $username = $data['username'];
        $role = $data['role'];

        $stmt = $this->conn->prepare("UPDATE Usuarios SET nombre = ?, correo = ?, username = ?, role = ? WHERE id = ?");
        $stmt->bind_param("ssssi", $nombre, $correo, $username, $role, $id);

        if ($stmt->execute()) {
            return ["success" => true, "message" => "Usuario actualizado correctamente."];
        } else {
            return ["success" => false, "message" => "Error al actualizar el usuario: " . $this->conn->error];
        }
    }

    public function eliminarUsuario($id) {
        $stmt = $this->conn->prepare("DELETE FROM Usuarios WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            return ["success" => true, "message" => "Usuario eliminado correctamente."];
        } else {
            return ["success" => false, "message" => "Error al eliminar el usuario: " . $this->conn->error];
        }
    }

    public function cambiarContrasenaConToken($token, $nuevaContrasena) {
        if (!$token || !$nuevaContrasena) {
            return ['success' => false, 'message' => 'Token o contraseña faltante.'];
        }

        $stmt = $this->conn->prepare("
            SELECT id
            FROM Usuarios
            WHERE reset_token = ? AND reset_token_expiry > NOW()
        ");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            return ['success' => false, 'message' => 'Token inválido o expirado.'];
        }

        $usuario = $result->fetch_assoc();
        $id_usuario = $usuario['id'];
        $passwordHash = password_hash($nuevaContrasena, PASSWORD_DEFAULT);

        $stmt = $this->conn->prepare("
            UPDATE Usuarios
            SET password = ?, reset_token = NULL, reset_token_expiry = NULL
            WHERE id = ?
        ");
        $stmt->bind_param("si", $passwordHash, $id_usuario);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Contraseña actualizada correctamente.'];
        } else {
            return ['success' => false, 'message' => 'Error al actualizar la contraseña: ' . $this->conn->error];
        }
    }
}
?>
