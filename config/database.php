<?php
declare(strict_types=1);

function database(): PDO
{
    static $connection = null;
    if ($connection instanceof PDO) {
        return $connection;
    }

    $projectConfig = [];
    $envFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
    if (is_file($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES);
        if ($lines === false) {
            throw new RuntimeException('The project database configuration could not be read.');
        }
        foreach ($lines as $index => $line) {
            if ($index === 0) {
                $line = preg_replace('/^\xEF\xBB\xBF/', '', $line) ?? $line;
            }
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }
            if (!preg_match('/^(DB_HOST|DB_PORT|DB_NAME|DB_USER|DB_PASSWORD)\s*=\s*(.*)$/', $line, $matches)) {
                throw new RuntimeException('The project .env file contains an invalid setting.');
            }
            $value = trim($matches[2]);
            if (strlen($value) >= 2 &&
                (($value[0] === '"' && $value[strlen($value) - 1] === '"') ||
                ($value[0] === "'" && $value[strlen($value) - 1] === "'"))) {
                $value = substr($value, 1, -1);
            }
            $projectConfig[$matches[1]] = $value;
        }
    }

    $localConfigPath = getenv('LOCALAPPDATA');
    if (is_string($localConfigPath) && $localConfigPath !== '') {
        $configFile = $localConfigPath . DIRECTORY_SEPARATOR . 'HauteHustle' . DIRECTORY_SEPARATOR . 'database.json';
        if (is_file($configFile)) {
            $localConfig = json_decode((string)file_get_contents($configFile), true);
            if (!is_array($localConfig)) {
                throw new RuntimeException('The local Haute Hustle database configuration is invalid.');
            }
        } else {
            $localConfig = [];
        }
    } else {
        $localConfig = [];
    }

    $setting = static function (string $environmentName, string $configName, string $default) use ($projectConfig, $localConfig): string {
        $environmentValue = getenv($environmentName);
        if ($environmentValue !== false) {
            return $environmentValue;
        }
        if (array_key_exists($environmentName, $projectConfig)) {
            return $projectConfig[$environmentName];
        }
        $localValue = $localConfig[$configName] ?? $default;
        return is_string($localValue) ? $localValue : $default;
    };
    $host = $setting('DB_HOST', 'host', '127.0.0.1');
    $port = $setting('DB_PORT', 'port', '3306');
    $name = $setting('DB_NAME', 'database', '');
    $username = $setting('DB_USER', 'username', '');
    $password = $setting('DB_PASSWORD', 'password', '');
    if (!is_string($host) || !is_string($port) || !is_string($name) ||
        !is_string($username) || !is_string($password) || $name === '' || $username === '') {
        throw new RuntimeException('Database settings are missing. Configure DB_HOST, DB_PORT, DB_NAME, DB_USER and DB_PASSWORD in .env or run bin\\setup-local.ps1.');
    }

    $connection = new PDO(
        "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
    return $connection;
}
