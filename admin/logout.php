<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/http.php';
require_admin(false);
if ($_SERVER['REQUEST_METHOD'] !== 'POST' ||
    !hash_equals((string)($_SESSION['csrf_token'] ?? ''), (string)($_POST['csrf_token'] ?? ''))) {
    http_response_code(405);
    exit('Invalid logout request.');
}
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 42000,
        'path' => $params['path'],
        'domain' => $params['domain'],
        'secure' => $params['secure'],
        'httponly' => $params['httponly'],
        'samesite' => 'Strict',
    ]);
}
session_destroy();
header('Location: login.php');
exit;
