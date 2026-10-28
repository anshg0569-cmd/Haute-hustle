<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/http.php';
require_admin();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    json_response(['error' => 'Method not allowed.'], 405);
}

require_valid_csrf();

$upload = $_FILES['image'] ?? null;
if (!is_array($upload)) {
    json_response(['error' => 'Choose a product image to upload.'], 422);
}

$uploadError = (int)($upload['error'] ?? UPLOAD_ERR_NO_FILE);
if ($uploadError !== UPLOAD_ERR_OK) {
    $message = match ($uploadError) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'The image must be no larger than 5 MB.',
        UPLOAD_ERR_NO_FILE => 'Choose a product image to upload.',
        UPLOAD_ERR_PARTIAL => 'The image upload was incomplete. Please try again.',
        default => 'The image could not be uploaded. Check the server upload configuration.',
    };
    json_response(['error' => $message], $uploadError === UPLOAD_ERR_INI_SIZE || $uploadError === UPLOAD_ERR_FORM_SIZE ? 413 : 422);
}

$temporaryPath = $upload['tmp_name'] ?? '';
if (!is_string($temporaryPath) || !is_uploaded_file($temporaryPath)) {
    json_response(['error' => 'The image must be a valid file no larger than 5 MB.'], 422);
}
$fileSize = filesize($temporaryPath);
if (!is_int($fileSize) || $fileSize < 1 || $fileSize > 5 * 1024 * 1024) {
    json_response(['error' => 'The image must be a valid file no larger than 5 MB.'], 422);
}

$imageInfo = @getimagesize($temporaryPath);
$extensions = [
    IMAGETYPE_JPEG => 'jpg',
    IMAGETYPE_PNG => 'png',
    IMAGETYPE_WEBP => 'webp',
];
if (!is_array($imageInfo) || !isset($extensions[$imageInfo[2]]) ||
    $imageInfo[0] < 1 || $imageInfo[1] < 1 || $imageInfo[0] > 10000 || $imageInfo[1] > 10000 ||
    $imageInfo[0] * $imageInfo[1] > 40000000) {
    json_response(['error' => 'Use a valid JPEG, PNG or WebP image within the supported dimensions.'], 422);
}

$directory = dirname(__DIR__) . '/uploads/products';
if (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory)) {
    error_log('Admin image upload failed: could not create the product image directory.');
    json_response(['error' => 'The image could not be stored. Check the upload directory permissions.'], 500);
}

$filename = bin2hex(random_bytes(20)) . '.' . $extensions[$imageInfo[2]];
$destination = $directory . '/' . $filename;
if (!move_uploaded_file($temporaryPath, $destination)) {
    error_log('Admin image upload failed: could not move the validated image.');
    json_response(['error' => 'The image could not be stored. Check the upload directory permissions.'], 500);
}

json_response(['success' => true, 'image' => 'uploads/products/' . $filename], 201);
