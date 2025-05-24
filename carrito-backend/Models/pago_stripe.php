<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../vendor/autoload.php';

use Stripe\Stripe;
use Stripe\Checkout\Session;

Stripe::setApiKey("sk_test_51RM4t2FTCH3K5sJLBrzKhYICcdcecFnaeCeZPoPhFS33HdbzhiVFFw2C1D4jWKn8qeGTuYwuzzYizGXiGSRr22y4006ufK6aHo");

$input = json_decode(file_get_contents("php://input"), true);
$items = $input['items'] ?? [];
$totalRecibido = isset($input['total']) ? intval($input['total']) : 0;

$line_items = [];
$totalCalculado = 0;

foreach ($items as $item) {
    if (!isset($item['articulo_id'], $item['precio'], $item['cantidad'])) {
        echo json_encode(["error" => "Datos inválidos"]);
        http_response_code(400);
        exit();
    }

    $precioCentavos = intval(floatval($item['precio']) * 100);
    $cantidad = intval($item['cantidad']);
    $totalCalculado += $precioCentavos * $cantidad;

    $line_items[] = [
        'price_data' => [
            'currency' => 'COP',
            'product_data' => ['name' => $item['articulo_id']],
            'unit_amount' => $precioCentavos,
        ],
        'quantity' => $cantidad,
    ];
}

if ($totalRecibido !== $totalCalculado) {
    echo json_encode([
        "error" => "El total enviado ($totalRecibido) no coincide con el calculado ($totalCalculado)."
    ]);
    http_response_code(400);
    exit();
}

try {
    $session = Session::create([
        'payment_method_types' => ['card'],
        'line_items' => $line_items,
        'mode' => 'payment',
        'success_url' => 'http://localhost:5173/success',
        'cancel_url' => 'http://localhost:5173/cancel',
    ]);

    echo json_encode(['id' => $session->id]);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
    http_response_code(500);
}
?>
