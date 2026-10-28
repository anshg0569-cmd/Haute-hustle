<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed.'], 405);
}

$data = json_input();
$name = trim((string)($data['customer'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$phone = preg_replace('/\D/', '', (string)($data['phone'] ?? ''));
$address = trim((string)($data['address'] ?? ''));
$city = trim((string)($data['city'] ?? ''));
$postalCode = preg_replace('/\D/', '', (string)($data['postalCode'] ?? ''));
$paymentMethod = (string)($data['paymentMethod'] ?? '');
$provider = trim((string)($data['paymentProvider'] ?? ''));
$coupon = strtoupper(trim((string)($data['coupon'] ?? '')));
$items = $data['items'] ?? null;
$methods = ['upi', 'card', 'cod', 'netbanking', 'wallet'];
$providers = [
    'upi' => ['Google Pay (demo)', 'PhonePe (demo)', 'Paytm (demo)'],
    'card' => ['Visa (demo)', 'Mastercard (demo)', 'RuPay (demo)'],
    'cod' => ['Cash on delivery (demo)'],
    'netbanking' => ['State Bank of India (demo)', 'HDFC Bank (demo)', 'ICICI Bank (demo)'],
    'wallet' => ['Haute Hustle demo wallet'],
];
if ($name === '' || text_length($name) > 80 || !filter_var($email, FILTER_VALIDATE_EMAIL) || text_length($email) > 120 ||
    strlen((string)$phone) !== 10 || $address === '' || text_length($address) > 250 || $city === '' ||
    text_length($city) > 80 || strlen((string)$postalCode) !== 6 || !in_array($paymentMethod, $methods, true) ||
    !in_array($provider, $providers[$paymentMethod] ?? [], true) || !is_array($items) || count($items) < 1 || count($items) > 50 ||
    ($coupon !== '' && !in_array($coupon, ['HAUTE10', 'THRIFT15'], true))) {
    json_response(['error' => 'Please check your delivery details, payment selection and bag contents.'], 422);
}

try {
    $pdo = database();
    $pdo->beginTransaction();
    $productQuery = $pdo->prepare(
        'SELECT id, public_id, name, price, stock, sizes_json FROM products WHERE public_id = ? AND is_active = 1 FOR UPDATE'
    );
    $preparedItems = [];
    $subtotal = 0;
    foreach ($items as $item) {
        if (!is_array($item)) {
            throw new DomainException('An item in your bag is invalid.');
        }
        $productId = (string)($item['productId'] ?? '');
        $quantity = filter_var($item['quantity'] ?? null, FILTER_VALIDATE_INT);
        $size = trim((string)($item['size'] ?? ''));
        if (!preg_match('/^[a-zA-Z0-9_-]{1,80}$/', $productId) || !is_int($quantity) || $quantity < 1 || $quantity > 99 || $size === '' || text_length($size) > 30) {
            throw new DomainException('An item in your bag is invalid.');
        }
        $productQuery->execute([$productId]);
        $product = $productQuery->fetch();
        $sizes = $product ? (json_decode((string)$product['sizes_json'], true) ?: []) : [];
        if (!$product || !in_array($size, $sizes, true) || $quantity > (int)$product['stock']) {
            throw new DomainException('A product is no longer available in the requested quantity. Please review your bag.');
        }
        $lineTotal = (int)$product['price'] * $quantity;
        $subtotal += $lineTotal;
        $preparedItems[] = [
            'product_id' => (int)$product['id'],
            'product_name' => (string)$product['name'],
            'size' => $size,
            'quantity' => $quantity,
            'unit_price' => (int)$product['price'],
            'line_total' => $lineTotal,
        ];
    }
    $discount = $coupon === 'HAUTE10' ? (int)round($subtotal * 0.10) : ($coupon === 'THRIFT15' ? (int)round($subtotal * 0.15) : 0);
    $shipping = $subtotal === 0 || $subtotal >= 2000 ? 0 : 99;
    $total = max(0, $subtotal - $discount + $shipping);
    $orderId = 'HH-' . strtoupper(bin2hex(random_bytes(6)));
    $insertOrder = $pdo->prepare(
        'INSERT INTO orders (order_number, customer_name, email, phone, address, city, postal_code, subtotal, discount, shipping, total, coupon, payment_method, payment_provider, payment_status, order_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $insertOrder->execute([
        $orderId, $name, $email, $phone, $address, $city, $postalCode, $subtotal, $discount, $shipping, $total,
        $coupon !== '' ? $coupon : null, $paymentMethod, $provider, 'Not charged (demo)', 'Pending',
    ]);
    $orderKey = (int)$pdo->lastInsertId();
    $insertLine = $pdo->prepare(
        'INSERT INTO order_items (order_id, product_id, product_name, size, quantity, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $reduceStock = $pdo->prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');
    foreach ($preparedItems as $item) {
        $insertLine->execute([$orderKey, $item['product_id'], $item['product_name'], $item['size'], $item['quantity'], $item['unit_price'], $item['line_total']]);
        $reduceStock->execute([$item['quantity'], $item['product_id'], $item['quantity']]);
        if ($reduceStock->rowCount() !== 1) {
            throw new DomainException('A product has just sold out. Please review your bag.');
        }
    }
    $pdo->commit();
    json_response(['order' => [
        'id' => $orderId,
        'createdAt' => date(DATE_ATOM),
        'customer' => $name,
        'email' => $email,
        'items' => array_map(static fn(array $item): array => [
            'name' => $item['product_name'], 'size' => $item['size'], 'quantity' => $item['quantity'], 'price' => $item['unit_price'],
        ], $preparedItems),
        'subtotal' => $subtotal, 'discount' => $discount, 'shipping' => $shipping, 'total' => $total,
        'coupon' => $coupon, 'paymentMethod' => $paymentMethod, 'paymentProvider' => $provider,
        'status' => 'Pending',
    ]], 201);
} catch (DomainException $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    json_response(['error' => $error->getMessage()], 409);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Order creation failed: ' . $error->getMessage());
    json_response(['error' => 'The order could not be saved. Please try again.'], 500);
}
