$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$mysqlClientCandidates = @(
    'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe',
    'C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe'
)
$mysqlClient = $mysqlClientCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
$schemaFile = Join-Path $projectRoot 'database\schema.sql'
$phpExecutable = (Get-Command php -ErrorAction Stop).Source
$appConfigDirectory = Join-Path $env:LOCALAPPDATA 'HauteHustle'
$appConfigFile = Join-Path $appConfigDirectory 'database.json'

if (-not $mysqlClient) {
    throw 'The MySQL command-line client was not found. Install MySQL Server 8.0 or 8.4, or add mysql.exe to PATH.'
}
if (-not (Test-Path (Join-Path (Split-Path -Parent $phpExecutable) 'ext\php_pdo_mysql.dll'))) {
    throw 'The PHP PDO MySQL extension (php_pdo_mysql.dll) is missing from this PHP installation.'
}

$mysqlAdminUsername = (Read-Host 'MySQL administrator username (often root)').Trim()
if ($mysqlAdminUsername -notmatch '^[A-Za-z0-9_.@-]{1,32}$') {
    throw 'Enter a MySQL username of up to 32 letters, numbers, underscores, dots, @ signs, or hyphens. Enter only the username, not @host.'
}
$rootSecurePassword = Read-Host 'Enter your MySQL administrator password' -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootSecurePassword)
try {
    $env:MYSQL_PWD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
    $rootSecurePassword.Dispose()
}

try {
    & $mysqlClient --host=127.0.0.1 --port=3306 "--user=$mysqlAdminUsername" --batch --skip-column-names --execute='SELECT 1'
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not log in to MySQL. Check that the MySQL service is running and the username and password are correct.'
    }

    $databaseExists = & $mysqlClient --host=127.0.0.1 --port=3306 "--user=$mysqlAdminUsername" --batch --skip-column-names --execute="SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name = 'haute_hustle'"
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not check the haute_hustle database.'
    }
    $shouldImportSchema = [string]$databaseExists -eq '0'
    if (-not $shouldImportSchema) {
        $tableCount = & $mysqlClient --host=127.0.0.1 --port=3306 "--user=$mysqlAdminUsername" --batch --skip-column-names --execute="SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'haute_hustle'"
        if ($LASTEXITCODE -ne 0) {
            throw 'Could not inspect tables in the haute_hustle database.'
        }
        $shouldImportSchema = [int]$tableCount -eq 0
        if (-not $shouldImportSchema) {
            $requiredTables = @('products', 'admins', 'admin_login_attempts', 'orders', 'order_items')
            $existingTables = & $mysqlClient --host=127.0.0.1 --port=3306 "--user=$mysqlAdminUsername" --batch --skip-column-names --execute="SELECT table_name FROM information_schema.tables WHERE table_schema = 'haute_hustle'"
            if ($LASTEXITCODE -ne 0) {
                throw 'Could not verify the Haute Hustle database tables.'
            }
            $missingTables = @($requiredTables | Where-Object { $_ -notin $existingTables })
            if ($missingTables.Count -gt 0) {
                throw "The existing haute_hustle database is incomplete (missing: $($missingTables -join ', ')). It was not changed; resolve the missing tables before setup."
            }
        }
    }

    if ($shouldImportSchema) {
        Get-Content -Path $schemaFile -Raw | & $mysqlClient --host=127.0.0.1 --port=3306 "--user=$mysqlAdminUsername" --default-character-set=utf8mb4
        if ($LASTEXITCODE -ne 0) {
            throw 'The schema import failed. Check the MySQL error above before retrying.'
        }
        Write-Output 'Initialized an empty database with the Haute Hustle tables and sample catalogue.'
    } else {
        Write-Output 'Using the existing haute_hustle database; existing store data was not re-imported.'
    }

    $randomBytes = New-Object byte[] 32
    $randomGenerator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $randomGenerator.GetBytes($randomBytes)
    } finally {
        $randomGenerator.Dispose()
    }
    $appPassword = [Convert]::ToBase64String($randomBytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
    $userSql = @"
CREATE USER IF NOT EXISTS 'haute_hustle_app'@'localhost' IDENTIFIED BY '$appPassword';
ALTER USER 'haute_hustle_app'@'localhost' IDENTIFIED BY '$appPassword';
GRANT SELECT, INSERT, UPDATE, DELETE ON haute_hustle.* TO 'haute_hustle_app'@'localhost';
CREATE USER IF NOT EXISTS 'haute_hustle_app'@'127.0.0.1' IDENTIFIED BY '$appPassword';
ALTER USER 'haute_hustle_app'@'127.0.0.1' IDENTIFIED BY '$appPassword';
GRANT SELECT, INSERT, UPDATE, DELETE ON haute_hustle.* TO 'haute_hustle_app'@'127.0.0.1';
"@
    $userSql | & $mysqlClient --host=127.0.0.1 --port=3306 "--user=$mysqlAdminUsername"
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not create the local Haute Hustle database account.'
    }

    if (-not (Test-Path $appConfigDirectory)) {
        New-Item -ItemType Directory -Path $appConfigDirectory | Out-Null
    }
    $currentWindowsUser = (whoami).Trim()
    & icacls.exe $appConfigDirectory /inheritance:r /grant:r "$($currentWindowsUser):(OI)(CI)F" | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not restrict access to the local Haute Hustle database configuration directory.'
    }
    $configuration = @{
        host = '127.0.0.1'
        port = '3306'
        database = 'haute_hustle'
        username = 'haute_hustle_app'
        password = $appPassword
    } | ConvertTo-Json
    [System.IO.File]::WriteAllText($appConfigFile, $configuration, [System.Text.UTF8Encoding]::new($false))
    & icacls.exe $appConfigFile /inheritance:r /grant:r "$($currentWindowsUser):F" | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not restrict access to the local Haute Hustle database configuration file.'
    }

    $env:DB_HOST = '127.0.0.1'
    $env:DB_PORT = '3306'
    $env:DB_NAME = 'haute_hustle'
    $env:DB_USER = 'haute_hustle_app'
    $env:DB_PASSWORD = $appPassword
    $env:MYSQL_PWD = $appPassword

    & $phpExecutable -d extension=pdo_mysql (Join-Path $projectRoot 'bin\verify-database.php')
    if ($LASTEXITCODE -ne 0) {
        throw 'PHP could not verify the new local database connection. Review the error above; no admin setup was attempted.'
    }

    $adminCount = & $mysqlClient --host=127.0.0.1 --port=3306 --user=haute_hustle_app --database=haute_hustle --batch --skip-column-names --execute='SELECT COUNT(*) FROM admins'
    if ($LASTEXITCODE -ne 0) {
        throw 'The haute_hustle database is missing its admin table. Existing database data was left unchanged.'
    }
    $createAdmin = [int]$adminCount -eq 0
    if (-not $createAdmin) {
        $addAdmin = (Read-Host 'An admin account already exists. Create an additional admin account? (y/N)').Trim()
        $createAdmin = $addAdmin -match '^(?i:y|yes)$'
    }
    if ($createAdmin) {
        $adminUsername = (Read-Host 'Choose your admin username').Trim()
        $adminPasswordSecure = Read-Host 'Choose a private admin password (12-72 characters)' -AsSecureString
        $adminPasswordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminPasswordSecure)
        try {
            $env:ADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($adminPasswordPointer)
        } finally {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($adminPasswordPointer)
            $adminPasswordSecure.Dispose()
        }
        if ([Text.Encoding]::UTF8.GetByteCount($env:ADMIN_PASSWORD) -lt 12 -or
            [Text.Encoding]::UTF8.GetByteCount($env:ADMIN_PASSWORD) -gt 72) {
            throw 'The admin password must contain 12 to 72 UTF-8 bytes.'
        }
        if ($adminUsername -eq '' -or $adminUsername.Length -gt 100) {
            throw 'Choose an admin username containing 1 to 100 characters.'
        }
        $env:ADMIN_USERNAME = $adminUsername
        if ([int]$adminCount -gt 0) {
            $env:ADMIN_ALLOW_ADDITIONAL = '1'
        }
        & $phpExecutable -d extension=pdo_mysql (Join-Path $projectRoot 'bin\create-admin.php')
        if ($LASTEXITCODE -ne 0) {
            throw 'Admin account setup failed. The database and existing store data were left in place.'
        }
        Remove-Item Env:ADMIN_USERNAME
        Remove-Item Env:ADMIN_PASSWORD
        Remove-Item Env:ADMIN_ALLOW_ADDITIONAL -ErrorAction SilentlyContinue
    } else {
        Write-Output 'Existing admin accounts were preserved. No new admin was created.'
    }

    & $phpExecutable -d extension=pdo_mysql (Join-Path $projectRoot 'bin\verify-database.php')
    if ($LASTEXITCODE -ne 0) {
        throw 'Final database and admin verification failed. Review the error above before signing in.'
    }

    Remove-Item Env:MYSQL_PWD
    foreach ($name in @('DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD')) {
        Remove-Item "Env:$name" -ErrorAction SilentlyContinue
    }
    $existingListener = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
    Write-Output 'Database setup finished. Storefront: http://127.0.0.1:8000/  Admin: http://127.0.0.1:8000/admin/'
    if ($existingListener) {
        Write-Output 'Port 8000 already has a server. Stop that server, then run bin\run-local.ps1 in this terminal to start with the saved database connection.'
    } else {
        Write-Output 'Starting Haute Hustle. Keep this PowerShell window open.'
        Set-Location $projectRoot
        & $phpExecutable -d extension=pdo_mysql -d upload_max_filesize=5M -d post_max_size=6M -S 127.0.0.1:8000 (Join-Path $PSScriptRoot 'server-router.php')
    }
} finally {
    Remove-Item Env:MYSQL_PWD -ErrorAction SilentlyContinue
    Remove-Item Env:ADMIN_USERNAME -ErrorAction SilentlyContinue
    Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:ADMIN_ALLOW_ADDITIONAL -ErrorAction SilentlyContinue
}
