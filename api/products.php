<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Method not allowed.'], 405);
}

try {
    $statement = database()->query(
        'SELECT public_id, name, description, category, condition_name, price, stock, image_path, sizes_json, rating, rating_count, image_fit
         FROM products WHERE is_active = 1 ORDER BY sort_order, id'
    );
    json_response(['products' => array_map('product_row', $statement->fetchAll())]);
} catch (Throwable $error) {
    error_log('Product catalogue request failed: ' . $error->getMessage());
    json_response(['error' => 'The product catalogue is temporarily unavailable. Check the PHP/MySQL configuration.'], 503);
}
