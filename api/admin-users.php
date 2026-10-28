<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/http.php';
require_admin();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    json_response(['error' => 'Method not allowed.'], 405);
}

require_valid_csrf();
$data = json_input();
$username = is_string($data['username'] ?? null) ? trim($data['username']) : '';
$password = is_string($data['password'] ?? null) ? $data['password'] : '';

if ($username === '' || text_length($username) > 100 || !valid_admin_password($password)) {
    json_response(['error' => 'Enter a username and a password containing 12 to 72 bytes.'], 422);
}

try {
    $statement = database()->prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)');
    $statement->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
    json_response(['success' => true], 201);
} catch (PDOException $error) {
    if ((string)$error->getCode() === '23000') {
        json_response(['error' => 'That admin username is already in use.'], 409);
    }
    error_log('Admin account creation failed: ' . $error->getMessage());
    json_response(['error' => 'The admin account could not be created.'], 500);
} catch (Throwable $error) {
    error_log('Admin account creation failed: ' . $error->getMessage());
    json_response(['error' => 'The admin account could not be created.'], 500);
}