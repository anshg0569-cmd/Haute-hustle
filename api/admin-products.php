<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/http.php';
require_admin();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = null;

try {
    $pdo = database();
    if ($method === 'GET') {
        $rows = $pdo->query(
            'SELECT public_id, name, description, category, condition_name, price, stock, image_path, sizes_json, rating, rating_count, image_fit
             FROM products WHERE is_active = 1 ORDER BY sort_order, id'
        )->fetchAll();
        json_response(['products' => array_map('product_row', $rows), 'csrfToken' => admin_csrf_token()]);
    }
    require_valid_csrf();

    if ($method === 'POST') {
        $data = json_input();
        $product = validate_product($data);
        $id = trim((string)($data['id'] ?? ''));
        $duplicateImage = $pdo->prepare(
            'SELECT 1 FROM products WHERE image_path = ? AND is_active = 1 AND (? = "" OR public_id <> ?) LIMIT 1'
        );
        $duplicateImage->execute([$product['image'], $id, $id]);
        if ($duplicateImage->fetchColumn()) {
            json_response(['error' => 'Each product must use a unique image URL.'], 409);
        }
        if ($id !== '') {
            $statement = $pdo->prepare(
                'UPDATE products SET name = ?, description = ?, category = ?, condition_name = ?, price = ?, stock = ?, image_path = ?, sizes_json = ?
                 WHERE public_id = ? AND is_active = 1'
            );
            $statement->execute([
                $product['name'], $product['description'], $product['category'], $product['condition'], $product['price'],
                $product['stock'], $product['image'], json_encode($product['sizes'], JSON_UNESCAPED_UNICODE), $id,
            ]);
            if ($statement->rowCount() === 0) {
                $exists = $pdo->prepare('SELECT 1 FROM products WHERE public_id = ? AND is_active = 1');
                $exists->execute([$id]);
                if (!$exists->fetchColumn()) {
                    json_response(['error' => 'That product could not be found. Reload the inventory and try again.'], 404);
                }
            }
        } else {
            $nextOrder = (int)$pdo->query('SELECT COALESCE(MAX(sort_order), 0) + 1 FROM products')->fetchColumn();
            $id = 'item-' . bin2hex(random_bytes(10));
            $statement = $pdo->prepare(
                'INSERT INTO products (public_id, name, description, category, condition_name, price, stock, image_path, sizes_json, rating, rating_count, image_fit, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 4.7, 0, "cover", ?)'
            );
            $statement->execute([
                $id, $product['name'], $product['description'], $product['category'], $product['condition'],
                $product['price'], $product['stock'], $product['image'], json_encode($product['sizes'], JSON_UNESCAPED_UNICODE), $nextOrder,
            ]);
        }
        json_response(['success' => true, 'productId' => $id]);
    }

    if ($method === 'DELETE') {
        $id = trim((string)($_GET['id'] ?? ''));
        if (!preg_match('/^[a-zA-Z0-9_-]{1,80}$/', $id)) {
            json_response(['error' => 'Select a valid product to delete.'], 422);
        }
        $statement = $pdo->prepare('DELETE FROM products WHERE public_id = ?');
        $statement->execute([$id]);
        if ($statement->rowCount() !== 1) {
            json_response(['error' => 'That product could not be found. Reload the inventory and try again.'], 404);
        }
        json_response(['success' => true]);
    }
    header('Allow: GET, POST, DELETE');
    json_response(['error' => 'Method not allowed.'], 405);
} catch (PDOException $error) {
    if ((string)$error->getCode() === '23000') {
        json_response(['error' => 'A product with that name or image already exists.'], 409);
    }
    error_log('Admin product request failed: ' . $error->getMessage());
    if (!($pdo instanceof PDO)) {
        json_response(['error' => 'Could not connect to MySQL. Check the local database setup and MySQL service.'], 503);
    }
    json_response(['error' => 'The product change could not be saved.'], 500);
} catch (Throwable $error) {
    error_log('Admin product request failed: ' . $error->getMessage());
    if (!($pdo instanceof PDO)) {
        json_response(['error' => 'Local database setup is missing or MySQL is unavailable. Run bin\\setup-local.ps1 and verify the connection.'], 503);
    }
    json_response(['error' => 'The product change could not be saved.'], 500);
}
