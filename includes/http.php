<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/config/database.php';

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function json_input(): array
{
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        json_response(['error' => 'Invalid JSON request.'], 400);
    }
    return $data;
}

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function valid_admin_password(string $password): bool
{
    return strlen($password) >= 12 && strlen($password) <= 72;
}

function start_secure_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function admin_csrf_token(): string
{
    start_secure_session();
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function require_admin(bool $json = true): void
{
    start_secure_session();
    if (isset($_SESSION['admin_id']) && is_int($_SESSION['admin_id'])) {
        return;
    }
    if ($json) {
        json_response(['error' => 'Please sign in to use the admin panel.'], 401);
    }
    header('Location: login.php');
    exit;
}

function require_valid_csrf(): void
{
    start_secure_session();
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($provided) || !hash_equals((string)($_SESSION['csrf_token'] ?? ''), $provided)) {
        json_response(['error' => 'Your session expired. Reload the admin page and try again.'], 419);
    }
}

function validate_product(array $data): array
{
    $categories = ['tops', 'dresses', 'jackets', 'jeans', 'trousers', 'skirts', 'sweaters', 'shoes', 'accessories', 'vintage'];
    $conditions = ['Like new', 'Excellent', 'Good', 'Vintage'];
    $stringFields = ['name', 'description', 'category', 'condition', 'image'];
    foreach ($stringFields as $field) {
        if (!is_string($data[$field] ?? null)) {
            json_response(['error' => 'Check the product name, description, category, condition and image.'], 422);
        }
    }
    $name = trim($data['name']);
    $description = trim($data['description']);
    $category = $data['category'];
    $condition = $data['condition'];
    $image = trim($data['image']);
    $price = filter_var($data['price'] ?? null, FILTER_VALIDATE_INT);
    $stock = filter_var($data['stock'] ?? null, FILTER_VALIDATE_INT);
    $sizes = $data['sizes'] ?? null;

    if ($name === '' || text_length($name) > 120 || $description === '' || text_length($description) > 2000 ||
        !in_array($category, $categories, true) || !in_array($condition, $conditions, true) ||
        !is_int($price) || $price < 1 || $price > 10000000 || !is_int($stock) || $stock < 0 || $stock > 1000000 ||
        !is_array($sizes) || count($sizes) < 1 || count($sizes) > 20 ||
        count(array_filter($sizes, 'is_string')) !== count($sizes)) {
        json_response(['error' => 'Check the product name, description, category, condition, price, stock and sizes.'], 422);
    }
    $sizes = array_values(array_unique(array_filter(array_map(
        static fn(string $size): string => trim($size),
        $sizes
    ), static fn(string $size): bool => $size !== '' && text_length($size) <= 30)));
    $uploadedImage = preg_match('~^uploads/products/[a-f0-9]{40}\.(?:jpg|png|webp)$~D', $image) === 1;
    $remoteImage = filter_var($image, FILTER_VALIDATE_URL) &&
        in_array(strtolower((string)parse_url($image, PHP_URL_SCHEME)), ['http', 'https'], true);
    if (!$sizes || (!$uploadedImage && !$remoteImage) || text_length($image) > 2048) {
        json_response(['error' => 'Provide at least one valid size and an HTTP(S) image URL or uploaded product image.'], 422);
    }
    return [
        'name' => $name,
        'description' => $description,
        'category' => $category,
        'condition' => $condition,
        'price' => $price,
        'stock' => $stock,
        'image' => $image,
        'sizes' => $sizes,
    ];
}

function product_row(array $row): array
{
    return [
        'id' => (string)$row['public_id'],
        'name' => (string)$row['name'],
        'description' => (string)$row['description'],
        'category' => (string)$row['category'],
        'condition' => (string)$row['condition_name'],
        'price' => (int)$row['price'],
        'stock' => (int)$row['stock'],
        'image' => (string)$row['image_path'],
        'sizes' => json_decode((string)$row['sizes_json'], true) ?: [],
        'rating' => (float)$row['rating'],
        'ratingCount' => (int)$row['rating_count'],
        'imageFit' => (string)$row['image_fit'],
    ];
}
