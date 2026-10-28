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
$currentPassword = is_string($data['currentPassword'] ?? null) ? $data['currentPassword'] : '';
$newPassword = is_string($data['newPassword'] ?? null) ? $data['newPassword'] : '';

if ($currentPassword === '' || strlen($currentPassword) > 1024 || !valid_admin_password($newPassword)) {
    json_response(['error' => 'Enter your current password and a new password containing 12 to 72 bytes.'], 422);
}

try {
    $pdo = database();
    $query = $pdo->prepare('SELECT password_hash FROM admins WHERE id = ? LIMIT 1');
    $query->execute([$_SESSION['admin_id']]);
    $passwordHash = $query->fetchColumn();
    if (!is_string($passwordHash) || !password_verify($currentPassword, $passwordHash)) {
        json_response(['error' => 'The current password is incorrect.'], 403);
    }

    $update = $pdo->prepare('UPDATE admins SET password_hash = ? WHERE id = ?');
    $update->execute([password_hash($newPassword, PASSWORD_DEFAULT), $_SESSION['admin_id']]);
    json_response(['success' => true]);
} catch (Throwable $error) {
    error_log('Admin password update failed: ' . $error->getMessage());
    json_response(['error' => 'The admin password could not be updated.'], 500);
}
