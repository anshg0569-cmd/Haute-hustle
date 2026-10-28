<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/http.php';
start_secure_session();
if (isset($_SESSION['admin_id']) && is_int($_SESSION['admin_id'])) {
    header('Location: dashboard.php');
    exit;
}
$csrf = admin_csrf_token();
$errorMessage = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = (string)($_POST['csrf_token'] ?? '');
    if (!hash_equals($csrf, $token)) {
        $errorMessage = 'Your sign-in form expired. Reload this page and try again.';
    } else {
        $username = trim((string)($_POST['username'] ?? ''));
        $password = (string)($_POST['password'] ?? '');
        $ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
        try {
            $pdo = database();
            $pdo->exec('DELETE FROM admin_login_attempts WHERE attempted_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY)');
            $attempts = $pdo->prepare(
                'SELECT COUNT(*) FROM admin_login_attempts WHERE ip_address = ? AND attempted_at > DATE_SUB(UTC_TIMESTAMP(), INTERVAL 15 MINUTE)'
            );
            $attempts->execute([$ip]);
            if ((int)$attempts->fetchColumn() >= 5) {
                $errorMessage = 'Too many sign-in attempts. Please wait 15 minutes and try again.';
            } elseif ($username === '' || text_length($username) > 100 || strlen($password) > 1024) {
                $errorMessage = 'Enter a valid username and password.';
            } else {
                $query = $pdo->prepare('SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1');
                $query->execute([$username]);
                $admin = $query->fetch();
                if ($admin && password_verify($password, (string)$admin['password_hash'])) {
                    session_regenerate_id(true);
                    $_SESSION['admin_id'] = (int)$admin['id'];
                    $_SESSION['admin_username'] = (string)$admin['username'];
                    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
                    $clear = $pdo->prepare('DELETE FROM admin_login_attempts WHERE ip_address = ?');
                    $clear->execute([$ip]);
                    header('Location: dashboard.php');
                    exit;
                }
                $record = $pdo->prepare('INSERT INTO admin_login_attempts (ip_address, attempted_at) VALUES (?, UTC_TIMESTAMP())');
                $record->execute([$ip]);
                $errorMessage = 'Incorrect username or password.';
            }
        } catch (PDOException $error) {
            error_log('Admin sign-in database connection failed: ' . $error->getMessage());
            $errorMessage = 'Could not connect to MySQL. Check the local database configuration and MySQL service, then rerun the setup helper.';
        } catch (RuntimeException $error) {
            error_log('Admin sign-in failed: ' . $error->getMessage());
            $errorMessage = 'Local database setup is missing or invalid. Run bin\\setup-local.ps1 from the project folder.';
        } catch (Throwable $error) {
            error_log('Admin sign-in failed: ' . $error->getMessage());
            $errorMessage = 'Admin sign-in is temporarily unavailable. Check the PHP server error log.';
        }
    }
}
header('Cache-Control: no-store');
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#f7f2e8">
  <title>Admin sign in — Haute Hustle</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css">
</head>
<body class="admin-page">
  <div class="demo-banner">Private administrator sign in</div>
  <header class="site-header"><a class="brand" href="../">HAUTE <span>HUSTLE</span></a><div class="header-actions"><a class="button button-outline" href="../">Back to start</a></div></header>
  <main class="section-wrap admin-section">
    <section class="admin-login panel" aria-labelledby="loginTitle">
      <p class="eyebrow">HAUTE HUSTLE · PRIVATE</p>
      <h1 id="loginTitle">Admin <em>sign in.</em></h1>
      <p class="section-intro">Enter your administrator username and password to access the private store dashboard.</p>
      <form method="post" action="login.php">
        <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8') ?>">
        <label>Username<input name="username" required maxlength="100" autocomplete="username"></label>
        <label>Password<input name="password" type="password" required maxlength="1024" autocomplete="current-password" aria-describedby="passwordHelp"></label>
        <small id="passwordHelp">Existing administrator credentials continue to work. Update any legacy PIN to a strong password after signing in.</small>
        <button class="button button-dark button-full" type="submit">Sign in</button>
        <?php if ($errorMessage !== ''): ?>
          <p class="form-status is-error" role="alert"><?= htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8') ?></p>
        <?php endif; ?>
      </form>
    </section>
  </main>
  <footer class="site-footer"><div class="footer-bottom"><span>© 2026 Haute Hustle</span><span>Private admin area</span></div></footer>
</body>
</html>
