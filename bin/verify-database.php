<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once dirname(__DIR__) . '/config/database.php';

try {
    $pdo = database();
    $requiredTables = ['products', 'admins', 'admin_login_attempts', 'orders', 'order_items'];
    $tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    $missingTables = array_values(array_diff($requiredTables, $tables));
    if ($missingTables) {
        fwrite(STDERR, 'Database is connected but required tables are missing: ' . implode(', ', $missingTables) . ".\n");
        exit(1);
    }

    $products = (int)$pdo->query('SELECT COUNT(*) FROM products WHERE is_active = 1')->fetchColumn();
    $admins = (int)$pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn();
    fwrite(STDOUT, "MySQL connection verified.\n");
    fwrite(STDOUT, "Active products: {$products}\n");
    fwrite(STDOUT, "Configured admin accounts: {$admins}\n");
} catch (Throwable $error) {
    error_log('Local database verification failed: ' . $error->getMessage());
    fwrite(STDERR, "Database verification failed. Check the MySQL service and local credentials; secrets are not printed.\n");
    exit(1);
}
