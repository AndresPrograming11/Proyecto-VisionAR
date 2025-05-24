<?php
require_once '../config/conexion.php';

class OrdenModel {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function obtenerOrdenesConDetalles($usuarioId = null) {
        $sql = "SELECT o.id, o.usuario_id, o.fecha, o.total, o.items, 
                       u.nombre AS nombre_usuario, u.correo
                FROM facturas o
                JOIN usuarios u ON o.usuario_id = u.id";

        if ($usuarioId !== null) {
            $sql .= " WHERE o.usuario_id = ?";
        }

        $stmt = $this->conn->prepare($sql);
        if ($usuarioId !== null) {
            $stmt->bind_param("i", $usuarioId);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $ordenes = [];

        while ($row = $result->fetch_assoc()) {
            $row['items'] = json_decode($row['items'], true) ?? [];

            foreach ($row['items'] as &$item) {
                $productoId = intval($item['producto_id']);
                $sqlProd = "SELECT nombre, precio FROM articulos WHERE id = ? LIMIT 1";
                $stmtProd = $this->conn->prepare($sqlProd);
                $stmtProd->bind_param("i", $productoId);
                $stmtProd->execute();
                $resProd = $stmtProd->get_result();

                if ($resProd->num_rows > 0) {
                    $prodData = $resProd->fetch_assoc();
                    $item['nombre_producto'] = $prodData['nombre'];
                    $item['precio_unitario'] = $prodData['precio'];
                } else {
                    $item['nombre_producto'] = "Producto no encontrado";
                    $item['precio_unitario'] = 0;
                }
            }

            $ordenes[] = $row;
        }

        return $ordenes;
    }
}
