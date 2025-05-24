<?php
class UsuarioModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function listarUsuarios() {
        $sql = "SELECT id, nombre, correo, username, role FROM usuarios";
        $result = $this->conn->query($sql);
        $usuarios = [];

        while ($row = $result->fetch_assoc()) {
            $usuarios[] = $row;
        }

        return $usuarios;
    }

    public function crearUsuario($data) {
        $nombre = $data['nombre'];
        $correo = $data['correo'];
        $username = $data['username'];
        $role = $data['role'];
        $contrasena = password_hash($data['contrasena'], PASSWORD_DEFAULT);

        $stmt = $this->conn->prepare("INSERT INTO usuarios (nombre, correo, username, contrasena, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $nombre, $correo, $username, $contrasena, $role);
        $resultado = $stmt->execute();

        return [
            "success" => $resultado,
            "message" => $resultado ? "Usuario creado correctamente" : "Error al crear usuario"
        ];
    }

    public function actualizarUsuario($data) {
        $id = $data['id'];
        $nombre = $data['nombre'];
        $correo = $data['correo'];
        $username = $data['username'];
        $role = $data['role'];

        $stmt = $this->conn->prepare("UPDATE usuarios SET nombre=?, correo=?, username=?, role=? WHERE id=?");
        $stmt->bind_param("ssssi", $nombre, $correo, $username, $role, $id);
        $resultado = $stmt->execute();

        return [
            "success" => $resultado,
            "message" => $resultado ? "Usuario actualizado correctamente" : "Error al actualizar usuario"
        ];
    }

    public function eliminarUsuario($id) {
        $stmt = $this->conn->prepare("DELETE FROM usuarios WHERE id=?");
        $stmt->bind_param("i", $id);
        $resultado = $stmt->execute();

        return [
            "success" => $resultado,
            "message" => $resultado ? "Usuario eliminado correctamente" : "Error al eliminar usuario"
        ];
    }
}
