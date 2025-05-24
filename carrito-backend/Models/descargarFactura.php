<?php
require('./fpdf182/fpdf.php');
include_once '../config/conexion.php';

if (!isset($_GET['id'])) {
    die("ID de factura no proporcionado.");
}

$id = intval($_GET['id']);

// 1. Obtener datos de la factura
$sqlFactura = "SELECT * FROM Facturas WHERE id = ?";
$stmtFactura = $conn->prepare($sqlFactura);
$stmtFactura->bind_param("i", $id);
$stmtFactura->execute();
$resultFactura = $stmtFactura->get_result();
$factura = $resultFactura->fetch_assoc();
$stmtFactura->close();

if (!$factura) {
    die("Factura no encontrada.");
}

// 2. Obtener nombre del usuario (si existe)
$usuario_id = $factura['usuario_id'];
$sqlUsuario = "SELECT nombre, email FROM Usuarios WHERE id = ?";
$stmtUsuario = $conn->prepare($sqlUsuario);
$stmtUsuario->bind_param("i", $usuario_id);
$stmtUsuario->execute();
$resultUsuario = $stmtUsuario->get_result();
$usuario = $resultUsuario->fetch_assoc();
$stmtUsuario->close();

$usuarioNombre = $usuario ? $usuario['nombre'] : "Usuario desconocido";
$usuarioEmail = $usuario ? $usuario['email'] : "-";

// 3. Parsear los items de la factura
$items = json_decode($factura['items'], true);

$pdf = new FPDF();
$pdf->AddPage();

// --- Encabezado
$pdf->SetFont('Arial', 'B', 16);
$pdf->Cell(0, 10, "Factura #" . $factura['id'], 0, 1, 'C');
$pdf->Ln(5);

// --- Información del cliente
$pdf->SetFont('Arial', '', 12);
$pdf->Cell(0, 10, "Cliente: " . $usuarioNombre, 0, 1);
$pdf->Cell(0, 10, "Correo: " . $usuarioEmail, 0, 1);
$pdf->Cell(0, 10, "Fecha: " . $factura['fecha'], 0, 1);
$pdf->Cell(0, 10, "Total: $" . number_format($factura['total'], 2), 0, 1);
$pdf->Ln(5);

// --- Tabla de items
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(80, 10, 'Producto', 1);
$pdf->Cell(30, 10, 'Cantidad', 1);
$pdf->Cell(40, 10, 'Precio', 1);
$pdf->Cell(40, 10, 'Subtotal', 1);
$pdf->Ln();

$pdf->SetFont('Arial', '', 12);
foreach ($items as $item) {
    $nombre = $item['nombre'];
    $cantidad = $item['cantidad'];
    $precio = $item['precio'];
    $subtotal = $cantidad * $precio;

    $pdf->Cell(80, 10, $nombre, 1);
    $pdf->Cell(30, 10, $cantidad, 1, 0, 'C');
    $pdf->Cell(40, 10, "$" . number_format($precio, 2), 1, 0, 'C');
    $pdf->Cell(40, 10, "$" . number_format($subtotal, 2), 1, 0, 'C');
    $pdf->Ln();
}

// --- Salida
$pdf->Output("D", "Factura_" . $factura['id'] . ".pdf");
