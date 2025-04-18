<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

ini_set('display_errors', 1);
error_reporting(E_ALL);
require 'db_conn.php';
require 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$auth = $_SERVER['HTTP_AUTHORIZATION'] ?? apache_request_headers()['Authorization'] ?? '';
if (!preg_match('/Bearer\s+(\S+)/', $auth, $m)) {
    echo json_encode(['status' => 'error', 'message' => 'Token not provided']);
    exit;
}
$token = $m[1];

$key = 'your_secret_key';
try {
    $dec = JWT::decode($token, new Key($key, 'HS256'));
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid token']);
    exit;
}

$userId = $dec->data->id;
$role = $dec->data->role;
$table = match ($role) {
    'admin' => 'admin',
    'staff' => 'staff',
    default => 'customer'
};
$idField = match ($role) {
    'admin' => 'admin_id',
    'staff' => 'staff_id',
    default => 'customer_id'
};

$stmt = $conn->prepare("SELECT username, email, phone_number, photo FROM $table WHERE $idField = :id");
$stmt->bindValue(':id', $userId, PDO::PARAM_INT);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
    exit;
}

$photoUrl = '';
if (!empty($user['photo'])) {
    $photoUrl = 'http://localhost/Backend/uploads/' . $user['photo'];
}

echo json_encode([
    'status' => 'success',
    'user' => [
        'username' => $user['username'],
        'email' => $user['email'],
        'phone_number' => $user['phone_number'],
        'photo_url' => $photoUrl
    ]
]);
