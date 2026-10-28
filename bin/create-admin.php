<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once dirname(__DIR__) . '/config/database.php';
$username = trim((string)getenv('ADMIN_USERNAME'));
$password = (string)getenv('ADMIN_PASSWORD');
if ($username === '' || strlen($username) > 100 || strlen($password) < 12 || strlen($password) > 72) {
    fwrite(STDERR, "Set ADMIN_USERNAME and an ADMIN_PASSWORD containing 12 to 72 bytes before running this setup command.\n");
    exit(1);
}

try {
    $pdo = database();
    $hasAdmins = (int)$pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn() > 0;
    if ($hasAdmins && getenv('ADMIN_ALLOW_ADDITIONAL') !== '1') {
        fwrite(STDERR, "An admin account already exists. Set ADMIN_ALLOW_ADDITIONAL=1 to explicitly create another account.\n");
        exit(1);
    }
    $statement = $pdo->prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)');
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    if (!is_string($passwordHash)) {
        throw new RuntimeException('The admin password could not be securely hashed.');
    }
    $statement->execute([$username, $passwordHash]);

    $verify = $pdo->prepare('SELECT password_hash FROM admins WHERE username = ? LIMIT 1');
    $verify->execute([$username]);
    $storedHash = $verify->fetchColumn();
    if (!is_string($storedHash) || !password_verify($password, $storedHash)) {
        throw new RuntimeException('The new admin account could not be verified.');
    }
    fwrite(STDOUT, "Admin account created and password-hash verification passed.\n");
} catch (Throwable $error) {
    fwrite(STDERR, "Could not create the admin account: " . $error->getMessage() . "\n");
    exit(1);
}
