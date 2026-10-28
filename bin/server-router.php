<?php
declare(strict_types=1);

$requestPath = parse_url((string)($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
$requestPath = is_string($requestPath) ? str_replace('\\', '/', rawurldecode($requestPath)) : '/';

if (str_contains($requestPath, "\0") ||
    preg_match('~(?:^|/)\.[^/]*|(?:^|/)(?:config|database|includes|bin)(?:/|$)~i', $requestPath) === 1) {
    http_response_code(404);
    exit('Not found.');
}

return false;
