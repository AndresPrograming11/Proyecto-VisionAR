<?php
require_once '../config/conexion.php';

class OrdenModel {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function obtenerOrdenesConDetalles($usuarioId) {
        $sql = "SELECT f.id, f.usuario_id, f.fecha, f.total, f.items, 
                       u.nombre AS nombre_usuario, u.correo
                FROM facturas f
                JOIN usuarios u ON f.usuario_id = u.id
                WHERE f.usuario_id = ?";

        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            die('Error en la preparación de la consulta: ' . $this->conn->error);
        }

        $stmt->bind_param("i", $usuarioId);
        if (!$stmt->execute()) {
            die('Error en la ejecución de la consulta: ' . $stmt->error);
        }

        $result = $stmt->get_result();
        $ordenes = [];
        $idsProductos = [];
        $facturasTemporal = [];

        while ($factura = $result->fetch_assoc()) {
            $items = json_decode($factura['items'], true) ?? [];
            $factura['items'] = $items;

            foreach ($items as $item) {
                if (isset($item['producto_id'])) {
                    $idsProductos[] = intval($item['producto_id']);
                }
            }

            $facturasTemporal[] = $factura;
        }

        $idsProductos = array_unique($idsProductos);

        $mapaProductos = [];
        if (count($idsProductos) > 0) {
            $placeholders = implode(',', array_fill(0, count($idsProductos), '?'));
            $tipos = str_repeat('i', count($idsProductos));

            $sqlProd = "SELECT id, nombre, precio FROM articulos WHERE id IN ($placeholders)";
            $stmtProd = $this->conn->prepare($sqlProd);
            if (!$stmtProd) {
                die('Error en la preparación de productos: ' . $this->conn->error);
            }

            $stmtProd->bind_param($tipos, ...$idsProductos);
            $stmtProd->execute();
            $resProd = $stmtProd->get_result();

            while ($prod = $resProd->fetch_assoc()) {
                $mapaProductos[$prod['id']] = $prod;
            }
            $stmtProd->close();
        }

        foreach ($facturasTemporal as &$factura) {
            foreach ($factura['items'] as &$item) {
                $idProd = intval($item['producto_id'] ?? 0);
                if ($idProd && isset($mapaProductos[$idProd])) {
                    $item['nombre_producto'] = $mapaProductos[$idProd]['nombre'];
                    $item['precio_unitario'] = floatval($mapaProductos[$idProd]['precio']);                 
                    
                } else {
                    $item['nombre_producto'] = "Producto no encontrado";
                    $item['precio_producto'] = 0;
                }
            }
            unset($item);
            $ordenes[] = $factura;
        }
        unset($factura);
        $stmt->close();

        return $ordenes;
    }
}
?>
