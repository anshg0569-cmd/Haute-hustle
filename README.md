# Haute Hustle

Haute Hustle is the existing responsive thrift-store storefront, now backed by PHP and MySQL for its live product catalogue and customer orders. The storefront's design, catalogue images, filtering, wishlists, cart, coupons, delivery form and simulated payment choices remain in place. Payments are still demonstrations: no payment credentials are collected and no money is charged.

## Project structure

- `index.php` — redirects the public root to the existing storefront.
- `api/products.php`, `api/orders.php` — public product catalogue and order-placement endpoints.
- `admin/index.php`, `admin/login.php`, `admin/dashboard.php` — private admin entry, session-protected sign-in and dashboard.
- `admin/dashboard.js`, `api/admin-products.php`, `api/admin-images.php`, `api/admin-orders.php`, `api/admin-users.php`, `api/admin-password.php` — authenticated product, image, order, administrator-account and password management.
- `uploads/products/` — generated-name JPEG, PNG and WebP uploads; uploaded files are size/type/dimension checked and only accepted image extensions are stored.
- `admin-demo.html` — compatibility redirect to the server-authenticated admin sign-in; the old browser-only editor is no longer served.
- `config/database.php`, `includes/http.php` — server-only database connection, `.env` loading, session, validation and HTTP helpers.
- `database/schema.sql` — database tables and the existing 50 sample products.
- `bin/create-admin.php` — one-time CLI-only initial administrator setup. Delete this script after creating the first admin account.
- `bin/verify-database.php` — CLI-only MySQL connection, schema and product/admin count check; never prints credentials.
- `bin/setup-local.ps1`, `bin/run-local.ps1`, `bin/server-router.php` — Windows local database setup and server start/restart helpers. The generated app-only database credentials are stored in the current Windows user's Local AppData folder, not in the public project directory; the router also blocks requests for private configuration and source folders.
- `.htaccess` — denies access to dotfiles and private source/configuration folders on Apache.
- `admin.html` — compatibility redirect to the private PHP login page; PHP must be enabled for the redirect target.

## Requirements

- PHP 8.1 or newer with PDO MySQL (`pdo_mysql`) enabled.
- MySQL 8.0+ or a compatible MariaDB server.
- A web server that executes PHP. The PHP built-in server is suitable for local development only.
- An internet connection for the existing externally hosted product images and fonts.
- No `package.json` or Composer manifest is present; the storefront uses browser JavaScript and the backend uses PHP directly, so no npm or Composer install is needed.

GitHub Pages and other static-only hosting cannot execute PHP or connect to MySQL. Use a host that supports both PHP and MySQL for deployment, and enable HTTPS in production.

## Configure and run in VS Code on Windows

1. Install PHP and MySQL, start the MySQL service, and open this project folder in VS Code. The setup helper detects the MySQL 8.0 or 8.4 command-line client in its standard Windows install folder.
2. In a PowerShell terminal at the project folder, run:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File bin\setup-local.ps1
   ```

   Enter your MySQL administrator username and password at the secure prompts; the common username `root` is only a suggestion, not an assumed credential. If you do not know either, open **MySQL Installer** from the Windows Start menu, choose the installed MySQL Server, select **Reconfigure**, and set/recover an administrator account through the installer. The script does not save that administrator password. Then choose an admin username and a private password (12–72 UTF-8 bytes) if the database has no admin yet. If admins already exist, the setup offers to add a separate account without overwriting them. The helper initializes the sample schema only for a new or empty database; it preserves existing store data and admin accounts, and stops without changing an incomplete database. It creates a separate least-privilege app-only MySQL account and saves its connection settings in a Windows-user-only Local AppData folder outside the project.
3. Keep the PowerShell window open while using the site. Open `http://127.0.0.1:8000/` for the storefront or `http://127.0.0.1:8000/admin/` for admin sign-in. Sign in with the username and password you chose. After stopping the server, restart it with:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File bin\run-local.ps1
   ```

   The PHP built-in web server is for local development only. Do not use VS Code Live Server or `file://` for database functionality; they do not execute PHP. The setup helper verifies that PHP can connect and that the required tables/products/admin accounts are visible before starting the server. It uses a private PHP router so `.env`, SQL files and backend source folders are not exposed by the local web server.

### Optional project `.env` configuration

The backend reads `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` and `DB_PASSWORD` from a project-root `.env` file. To configure that mode, first create a separate MySQL application user with only the required permissions (the setup helper above creates one automatically), then run:

```powershell
Copy-Item .env.example .env
notepad .env
```

Replace the placeholder values in `.env` with the app user's connection settings. Do not use the MySQL `root` account as `DB_USER`, do not paste credentials into source code or chat, and never commit `.env`. `.env.example` contains placeholders only; `.gitignore`, `.htaccess` and the local PHP router exclude the real file. Environment variables take precedence over `.env`, and `.env` takes precedence over the generated Local AppData configuration.

To validate that configuration and start the local server without the Local AppData setup file, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\bin\run-local.ps1
```

### Production deployment checklist

The local site is not automatically public. The MySQL server installed on your Windows PC is normally reachable only from that PC; a public web host cannot use `localhost` to connect to it. Create a MySQL database on the same hosting provider as the website, or use a separately managed database that explicitly allows connections from that host. Do not expose your home PC's MySQL server to the public internet.

1. Choose a PHP hosting provider with PHP 8.1+, `pdo_mysql`, PHP sessions, HTTPS, and MySQL 8+. Configure the domain's document root to the project folder containing `index.php` and `index.html`. The PHP built-in server and VS Code Live Server are not production web servers.
2. Deploy the project files while preserving the `admin`, `api`, `config`, `includes`, `uploads`, and `database` folders. Keep `.env.example` as the placeholder template, but do not upload a real `.env` into the public web root. Keep the `.htaccess` rules enabled on Apache; on another web server, configure equivalent denials for dotfiles and the `bin`, `config`, `database`, and `includes` folders.
3. In the hosting control panel, create the `haute_hustle` database (or note its provider-assigned name) and a separate application user. Grant that user only `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on this database. Use the database host and port shown by the provider—do not assume the host is `localhost` or `127.0.0.1`.
4. Import `database/schema.sql` into the hosting database once. If the provider prefixes database names and will not let you create a database literally named `haute_hustle`, replace the `CREATE DATABASE ...` and `USE haute_hustle;` lines at the top of the import copy with the provider-assigned database name. Importing the provided schema inserts the existing sample catalogue; do not re-import it later into a database containing products you want to keep.
5. Add `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` in the provider's protected PHP/application environment settings. The app reads these server-side only; never put them in HTML or JavaScript. If the provider offers no protected environment settings, put `.env` outside the document root and adapt the server-side configuration to read that private path; do not place live credentials in a publicly served directory.
6. Create the first admin account on the hosting server with SSH/CLI after schema import: use the provider's protected database settings in that CLI environment, securely prompt for `ADMIN_USERNAME` and `ADMIN_PASSWORD` (12–72 UTF-8 bytes), then run `php bin/create-admin.php`. The creation script deliberately refuses HTTP requests. Do not send passwords in a URL, source file, or chat. Confirm the new account works at `https://your-domain.example/admin/login.php`.
7. Ensure PHP can write product uploads to `uploads/products` and that the host allows uploads up to 5 MB (`upload_max_filesize=5M`, `post_max_size` at least `6M`). Keep the supplied upload-folder `.htaccess`, which disables PHP execution there.
8. Test the live `/api/products.php` endpoint, sign in at `/admin/login.php`, add a uniquely named test item with an image, and reload the storefront to confirm it appears. Edit and delete that test item to confirm all three operations work against the hosting database.
9. After initial setup, remove `bin/create-admin.php` and local setup scripts from the deployed server (or ensure `bin` remains inaccessible as configured). Use HTTPS for the entire site so administrator session cookies receive the Secure flag.

The deployment host and its remote database must be configured before production login or product changes can work. A local account or product saved in the MySQL server on this PC is not copied to the host automatically. Tell me which PHP hosting provider/domain you choose if you want provider-specific deployment commands and settings. Never put database passwords or admin passwords into HTML, JavaScript, a committed `.env` file or the public web root.

## Storefront and admin behavior

- The public storefront fetches active products from MySQL. Product updates, additions, stock changes and deletions appear in the public catalogue on refresh.
- Shopping cart, wishlist, coupon selection and order history use browser storage. When PHP/MySQL is available, checkout saves orders and decrements stock transactionally in MySQL. If the database is unavailable, checkout remains usable in local demo mode; those orders are saved only in the current browser and do not appear in the admin dashboard. Customer-facing tracking simulates every order as Pending, then Confirmed at 10 seconds, Shipped at 20 seconds and Delivered at 30 seconds. This is a browser-side demo timeline for both local and database-backed orders; it does not change MySQL order status or provide live carrier tracking.
- Checkout totals and product prices are recomputed on the server. The chosen payment method/provider is recorded as a demo selection, and payment status is explicitly `Not charged (demo)`.
- The separate admin dashboard requires a valid PHP session on every page and action. Administrators sign in with a username and password. Passwords created by the setup flow are 12–72 UTF-8 bytes and stored as PHP password hashes. Existing hashed credentials remain accepted so existing administrators are not locked out; after signing in, change a legacy PIN to a strong password in the dashboard. Admin account creation and password changes are authenticated and CSRF-protected. The dashboard supports product add/edit/delete, including descriptions, remote or safely uploaded images, sizes, price, category and stock; inventory search/category filtering; customer order and payment-status viewing; order-status updates; and product/order/sales-value statistics.
- Admin login attempts are limited to five per IP address in a rolling 15-minute window. Session cookies are HttpOnly and SameSite Strict; HTTPS automatically enables Secure cookies. Admin write requests require a CSRF token.
- Existing demo account and contact forms remain local demonstrations and do not send data to a server.

## Manual verification

1. Browse the storefront and confirm the original product data, images, filters and category rails load. No admin link is displayed in the public storefront.
2. Open `/admin/` signed out and confirm it shows the login form, not the dashboard. Check that a wrong password is rejected, change an existing admin password, create another password-protected admin account, and confirm the dashboard redirects to sign-in after logging out.
3. Add, edit and delete a product, then reload the storefront and verify the database-backed catalogue reflects each change. Also try product search/category filtering and a valid/invalid image upload.
4. Place a simulated order with valid delivery details. Verify the order appears in the dashboard with its items, total and `Not charged (demo)` payment status, and that stock decreases.
5. Change its order status and verify the updated status persists after reloading the dashboard.
6. Open the dashboard URL in a signed-out browser/private window and confirm it redirects to the login page.
