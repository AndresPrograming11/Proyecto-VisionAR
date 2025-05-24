<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require __DIR__ . '/vendor/autoload.php';

use Stripe\Stripe;
use Stripe\Checkout\Session;

Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

$input = json_decode(file_get_contents("php://input"), true);
$items = $input['items'];

$line_items = [];

foreach ($items as $item) {
    $line_items[] = [
        'price_data' => [
            'currency' => 'mxn',
            'product_data' => [
                'name' => $item['nombre'],
            ],
            'unit_amount' => intval($item['precio'] * 100),
        ],
        'quantity' => $item['cantidad'],
    ];
}

$session = Session::create([
    'payment_method_types' => ['card'],
    'line_items' => $line_items,
    'mode' => 'payment',
    'success_url' => 'http://localhost:5173/success',
    'cancel_url' => 'http://localhost:5173/cancel',
]);

echo json_encode(['id' => $session->id]);


