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

        // Prepara la consulta para obtener producto solo una vez
        $sqlProd = "SELECT nombre, precio FROM articulos WHERE id = ? LIMIT 1";
        $stmtProd = $this->conn->prepare($sqlProd);

        while ($row = $result->fetch_assoc()) {
            $row['items'] = json_decode($row['items'], true) ?? [];

            foreach ($row['items'] as &$item) {
                if (!isset($item['producto_id'])) {
                    $item['nombre_producto'] = "ID de producto faltante";
                    $item['precio_unitario'] = 0;
                    continue;
                }

                $productoId = intval($item['producto_id']);
                $stmtProd->bind_param("i", $productoId);
                $stmtProd->execute();
                $resProd = $stmtProd->get_result();

                if ($resProd && $resProd->num_rows > 0) {
                    $prodData = $resProd->fetch_assoc();
                    $nombreBase = $prodData['nombre'];
                    $talla = isset($item['talla']) ? " - Talla: " . $item['talla'] : "";
                    $item['nombre_producto'] = $nombreBase . $talla;
                    $item['precio_unitario'] = floatval($prodData['precio']);
                } else {
                    $item['nombre_producto'] = "Producto no encontrado";
                    $item['precio_unitario'] = 0;
                }
            }

            $ordenes[] = $row;
        }

        $stmtProd->close();
        return $ordenes;
    }
}
?>
