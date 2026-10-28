$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$configFile = Join-Path (Join-Path $env:LOCALAPPDATA 'HauteHustle') 'database.json'
$projectEnvFile = Join-Path $projectRoot '.env'
$phpExecutable = (Get-Command php -ErrorAction Stop).Source

if (-not (Test-Path $configFile) -and -not (Test-Path $projectEnvFile)) {
    throw 'Database configuration is missing. Configure project .env or run powershell -NoProfile -ExecutionPolicy Bypass -File bin\setup-local.ps1 first.'
}
if (-not (Test-Path (Join-Path (Split-Path -Parent $phpExecutable) 'ext\php_pdo_mysql.dll'))) {
    throw 'The PHP PDO MySQL extension (php_pdo_mysql.dll) is missing from this PHP installation.'
}

$hasLocalConfig = Test-Path $configFile
if ($hasLocalConfig) {
    $configuration = Get-Content -Path $configFile -Raw | ConvertFrom-Json
    foreach ($key in @('host', 'port', 'database', 'username', 'password')) {
        if ([string]::IsNullOrWhiteSpace([string]$configuration.$key)) {
            throw "The local database configuration is missing '$key'. Rerun bin\setup-local.ps1."
        }
    }
}

& $phpExecutable -d extension=pdo_mysql (Join-Path $projectRoot 'bin\verify-database.php')
if ($LASTEXITCODE -ne 0) {
    throw 'Database verification failed; the local server was not started.'
}

foreach ($name in @('DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD')) {
    Remove-Item "Env:$name" -ErrorAction SilentlyContinue
}

Set-Location $projectRoot
Write-Output 'Starting Haute Hustle. Keep this PowerShell window open.'
Write-Output 'Storefront: http://127.0.0.1:8000/'
Write-Output 'Admin:      http://127.0.0.1:8000/admin/'
& $phpExecutable -d extension=pdo_mysql -d upload_max_filesize=5M -d post_max_size=6M -S 127.0.0.1:8000 (Join-Path $PSScriptRoot 'server-router.php')
