<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/http.php';
require_admin(false);
header('Cache-Control: no-store');
$username = htmlspecialchars((string)($_SESSION['admin_username'] ?? 'Admin'), ENT_QUOTES, 'UTF-8');
$csrf = htmlspecialchars(admin_csrf_token(), ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#f7f2e8">
  <title>Admin dashboard — Haute Hustle</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css">
  <script src="dashboard.js" defer></script>
</head>
<body class="admin-page" data-csrf="<?= $csrf ?>">
  <div class="demo-banner">Private administrator dashboard</div>
  <header class="site-header">
    <a class="brand" href="../index.html">HAUTE <span>HUSTLE</span></a>
    <nav class="nav-links" aria-label="Admin navigation"><a href="../index.html">View store</a></nav>
    <div class="header-actions">
      <span class="admin-greeting">Signed in as <?= $username ?></span>
      <form action="logout.php" method="post"><input type="hidden" name="csrf_token" value="<?= $csrf ?>"><button class="button button-dark" type="submit">Log out</button></form>
    </div>
  </header>
  <main>
    <section class="admin-section section-wrap">
      <div class="admin-heading">
        <div><p class="eyebrow">HAUTE HUSTLE · ADMIN</p><h1>Store <em>dashboard.</em></h1><p class="section-intro">Manage live products and customer orders.</p></div>
        <div class="admin-stats"><span id="adminProductCount">—</span><small>active products</small></div>
      </div>
      <div class="admin-stats-row" aria-label="Store statistics">
        <article class="admin-stat-card"><small>Products</small><strong id="statProducts">—</strong></article>
        <article class="admin-stat-card"><small>Orders</small><strong id="statOrders">—</strong></article>
        <article class="admin-stat-card"><small>Sales value (demo)</small><strong id="statSales">—</strong></article>
      </div>
      <div class="admin-layout">
        <form class="admin-form panel" id="productForm">
          <h3 id="productFormHeading">Add a product</h3>
          <input id="editProductId" type="hidden">
          <label>Product name<input id="adminName" required maxlength="120"></label>
          <div class="form-row">
            <label>Category<select id="adminCategory" required>
              <option value="tops">Tops & shirts</option><option value="dresses">Dresses</option><option value="jackets">Jackets</option><option value="jeans">Jeans</option><option value="trousers">Trousers</option><option value="skirts">Skirts</option><option value="sweaters">Sweaters</option><option value="shoes">Shoes</option><option value="accessories">Accessories</option><option value="vintage">Vintage</option>
            </select></label>
            <label>Price (₹)<input id="adminPrice" type="number" min="1" max="10000000" step="1" required></label>
          </div>
          <div class="form-row">
            <label>Sizes (comma separated)<input id="adminSizes" required maxlength="400" placeholder="S, M, L"></label>
            <label>Stock<input id="adminStock" type="number" min="0" max="1000000" step="1" required value="1"></label>
          </div>
          <label>Condition<select id="adminCondition"><option>Like new</option><option>Excellent</option><option>Good</option><option>Vintage</option></select></label>
          <label>Image URL or uploaded image path<input id="adminImage" type="text" required maxlength="2048" placeholder="https://... or upload below"></label>
          <label>Upload product image (JPEG, PNG or WebP; up to 5 MB)<input id="adminImageUpload" type="file" accept="image/jpeg,image/png,image/webp"></label>
          <label>Description<textarea id="adminDescription" rows="3" required maxlength="2000"></textarea></label>
          <div class="admin-form-actions">
            <button class="button button-dark" id="saveProductButton" type="submit">Add product</button>
            <button class="button button-outline" id="cancelEditButton" type="button" hidden>Cancel edit</button>
          </div>
          <p class="form-status" id="adminStatus" role="status" aria-live="polite"></p>
        </form>
        <div class="inventory-panel panel">
          <div class="inventory-title"><h3>Live inventory</h3><span>MySQL database</span></div>
          <div class="inventory-filters">
            <label>Search products<input id="inventorySearch" type="search" autocomplete="off" placeholder="Name or description"></label>
            <label>Category<select id="inventoryCategoryFilter">
              <option value="all">All categories</option><option value="tops">Tops &amp; shirts</option><option value="dresses">Dresses</option><option value="jackets">Jackets</option><option value="jeans">Jeans</option><option value="trousers">Trousers</option><option value="skirts">Skirts</option><option value="sweaters">Sweaters</option><option value="shoes">Shoes</option><option value="accessories">Accessories</option><option value="vintage">Vintage</option>
            </select></label>
          </div>
          <div class="inventory-table-wrap"><table class="inventory-table"><thead><tr><th>Piece</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody id="adminProductRows"></tbody></table></div>
        </div>
      </div>
    </section>
    <section class="admin-section section-wrap admin-orders">
      <div class="admin-heading"><div><p class="eyebrow">CUSTOMER CHECKOUTS</p><h2>Customer <em>orders.</em></h2><p class="section-intro">Demo payments are not processed. Orders and payment status are stored in the database.</p></div></div>
      <div class="inventory-panel panel">
        <div class="inventory-table-wrap"><table class="inventory-table"><thead><tr><th>Order / customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Update</th></tr></thead><tbody id="adminOrderRows"></tbody></table></div>
      </div>
    </section>
    <section class="admin-section section-wrap">
      <div class="admin-heading"><div><p class="eyebrow">PRIVATE ACCESS</p><h2>Admin <em>accounts.</em></h2><p class="section-intro">Manage access for authorised store administrators.</p></div></div>
      <form class="admin-form panel" id="createAdminForm">
        <h3>Create admin account</h3>
        <label>Username<input id="newAdminUsername" name="username" required maxlength="100" autocomplete="username"></label>
        <label>Password<input id="newAdminPassword" name="password" type="password" required minlength="12" maxlength="72" autocomplete="new-password"></label>
        <label>Confirm password<input id="newAdminPasswordConfirm" type="password" required minlength="12" maxlength="72" autocomplete="new-password"></label>
        <button class="button button-dark" type="submit">Create account</button>
        <p class="form-status" id="adminAccountStatus" role="status" aria-live="polite"></p>
      </form>
      <form class="admin-form panel admin-password-form" id="changeAdminPasswordForm">
        <h3>Change your admin password</h3>
        <label>Current password<input id="currentAdminPassword" type="password" required maxlength="1024" autocomplete="current-password"></label>
        <label>New password (12-72 bytes)<input id="newOwnAdminPassword" type="password" required minlength="12" maxlength="72" autocomplete="new-password"></label>
        <label>Confirm new password<input id="newOwnAdminPasswordConfirm" type="password" required minlength="12" maxlength="72" autocomplete="new-password"></label>
        <button class="button button-dark" type="submit">Update password</button>
        <p class="form-status" id="adminPasswordStatus" role="status" aria-live="polite"></p>
      </form>
    </section>
  </main>
  <footer class="site-footer"><div class="footer-bottom"><span>© 2026 Haute Hustle</span><span>Private admin area</span></div></footer>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
</body>
</html>
