<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/http.php';
require_admin();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = null;

try {
    $pdo = database();
    if ($method === 'GET') {
        $orders = $pdo->query(
            'SELECT id, order_number, customer_name, email, phone, address, city, postal_code, subtotal, discount, shipping, total,
                    coupon, payment_method, payment_provider, payment_status, order_status, created_at
             FROM orders ORDER BY created_at DESC, id DESC'
        )->fetchAll();
        $lines = $pdo->query(
            'SELECT oi.order_id, oi.product_name, oi.size, oi.quantity, oi.unit_price, oi.line_total
             FROM order_items oi JOIN orders o ON o.id = oi.order_id ORDER BY oi.id'
        )->fetchAll();
        $itemsByOrder = [];
        foreach ($lines as $line) {
            $itemsByOrder[(int)$line['order_id']][] = [
                'name' => $line['product_name'], 'size' => $line['size'], 'quantity' => (int)$line['quantity'],
                'price' => (int)$line['unit_price'], 'lineTotal' => (int)$line['line_total'],
            ];
        }
        $stats = $pdo->query(
            "SELECT (SELECT COUNT(*) FROM products WHERE is_active = 1) AS products,
                    (SELECT COUNT(*) FROM orders) AS orders,
                    (SELECT COALESCE(SUM(total), 0) FROM orders WHERE order_status <> 'Cancelled') AS sales"
        )->fetch();
        $output = array_map(static function (array $order) use ($itemsByOrder): array {
            return [
                'id' => (int)$order['id'], 'orderNumber' => $order['order_number'],
                'customer' => $order['customer_name'], 'email' => $order['email'], 'phone' => $order['phone'],
                'address' => $order['address'], 'city' => $order['city'], 'postalCode' => $order['postal_code'],
                'subtotal' => (int)$order['subtotal'], 'discount' => (int)$order['discount'],
                'shipping' => (int)$order['shipping'], 'total' => (int)$order['total'],
                'coupon' => $order['coupon'], 'paymentMethod' => $order['payment_method'],
                'paymentProvider' => $order['payment_provider'], 'paymentStatus' => $order['payment_status'],
                'status' => $order['order_status'], 'createdAt' => $order['created_at'],
                'items' => $itemsByOrder[(int)$order['id']] ?? [],
            ];
        }, $orders);
        json_response([
            'orders' => $output,
            'stats' => ['products' => (int)$stats['products'], 'orders' => (int)$stats['orders'], 'sales' => (int)$stats['sales']],
            'csrfToken' => admin_csrf_token(),
        ]);
    }
    if ($method !== 'PATCH') {
        header('Allow: GET, PATCH');
        json_response(['error' => 'Method not allowed.'], 405);
    }
    require_valid_csrf();
    $data = json_input();
    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
    $status = (string)($data['status'] ?? '');
    if (!is_int($id) || $id < 1 || !in_array($status, ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], true)) {
        json_response(['error' => 'Choose a valid order and status.'], 422);
    }
    $update = $pdo->prepare('UPDATE orders SET order_status = ? WHERE id = ?');
    $update->execute([$status, $id]);
    if ($update->rowCount() === 0) {
        $exists = $pdo->prepare('SELECT 1 FROM orders WHERE id = ?');
        $exists->execute([$id]);
        if (!$exists->fetchColumn()) {
            json_response(['error' => 'That order could not be found.'], 404);
        }
    }
    json_response(['success' => true]);
} catch (Throwable $error) {
    error_log('Admin order request failed: ' . $error->getMessage());
    if (!($pdo instanceof PDO)) {
        json_response(['error' => 'Could not connect to MySQL. Check the local database setup and MySQL service.'], 503);
    }
    json_response(['error' => 'The order information could not be loaded or saved.'], 500);
}
