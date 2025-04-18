<?php
// login.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

require_once __DIR__ . '/db_conn.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Method not allowed."]);
    exit;
}

$body = file_get_contents('php://input');
$data = json_decode($body, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "status"  => "error",
        "message" => "Invalid JSON payload: " . json_last_error_msg()
    ]);
    exit;
}

$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';
$role     = $data['role'] ?? 'customer';

if ($username === '' || $password === '') {
    echo json_encode([
        "status"  => "error",
        "message" => "Username, password and role are required."
    ]);
    exit;
}

switch ($role) {
    case 'admin':
        $table = 'admin';     $idCol = 'admin_id';  break;
    case 'staff':
        $table = 'staff';     $idCol = 'staff_id';  break;
    default:
        $table = 'customer';  $idCol = 'customer_id'; break;
}

$sql = "SELECT {$idCol} AS id, username, password, email, phone_number, photo FROM {$table} WHERE username = :username LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bindValue(':username', $username);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode([
        "status"  => "error",
        "message" => "Incorrect username or password."
    ]);
    exit;
}

// Handle the photo field
$photoUrl = '';
if (!empty($user['photo'])) {
    if (mb_check_encoding($user['photo'], 'UTF-8') && !filter_var($user['photo'], FILTER_VALIDATE_URL)) {
        // Prevent double 'uploads/' prefix
        $photoPath = $user['photo'];
        if (strpos($photoPath, 'uploads/') !== false) {
            $photoPath = basename($photoPath); // extract filename only
        }
        $photoUrl = 'http://localhost/Backend/uploads/' . $photoPath;
    } else {
        $photoUrl = 'data:image/jpeg;base64,' . base64_encode($user['photo']);
    }
}
$salonId = null;
if ($role === 'admin') {
    $q = $conn->prepare("SELECT salon_id FROM salon WHERE admin_id = :a LIMIT 1");
    $q->execute([':a' => $user['id']]);
    $row = $q->fetch(PDO::FETCH_ASSOC);
    $salonId = $row['salon_id'] ?? null;
}

// Build complete user payload
$userPayload = [
    'id'           => $user['id'],
    'username'     => $user['username'],
    'name'         => $user['name'] ?? '',
    'email'        => $user['email'] ?? '',
    'phone_number' => $user['phone_number'] ?? '',
    'role'         => $role,
    'photoUrl'     => $photoUrl,
    "{$idCol}"     => $user['id'],
];

$userPayload[$idCol] = $user['id'];

if ($salonId !== null) {
    $userPayload['salon_id'] = (int)$salonId;
}

// Build JWT payload
$key     = 'your_secret_key';
$now     = time();
$payload = [
    'iat'  => $now,
    'exp'  => $now + 3600,
    'iss'  => 'your-domain.com',
    'aud'  => 'your-domain.com',
    'data' => $userPayload
];

$jwt = JWT::encode($payload, $key, 'HS256');

echo json_encode([
    'status' => 'success',
    'token'  => $jwt,
    'user'   => $userPayload
]);
