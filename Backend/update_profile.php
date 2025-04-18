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

$auth = null;
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $auth = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
} else {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
    }
}

if (!$auth || !preg_match('/Bearer\s+(\S+)/', $auth, $matches)) {
    echo json_encode(['status' => 'error', 'message' => 'Token not provided']);
    exit;
}
$token = $matches[1];

$key = 'your_secret_key';
try {
    $decoded = JWT::decode($token, new Key($key, 'HS256'));
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid token']);
    exit;
}

$userId = $decoded->data->id;
$role = $decoded->data->role;

switch ($role) {
    case 'admin':
        $table = 'admin';
        $idField = 'admin_id';
        break;
    case 'staff':
        $table = 'staff';
        $idField = 'staff_id';
        break;
    default:
        $table = 'customer';
        $idField = 'customer_id';
        break;
}

$fields = [];
$params = [];

if (isset($_POST['username'])) {
    $fields[] = 'username = :username';
    $params[':username'] = $_POST['username'];
}
if (isset($_POST['email'])) {
    $fields[] = 'email = :email';
    $params[':email'] = $_POST['email'];
}
if (isset($_POST['phone_number'])) {
    $fields[] = 'phone_number = :phone';
    $params[':phone'] = $_POST['phone_number'];
}


if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . "." . $ext;
    $target = __DIR__ . "/uploads/" . $filename;
    if (move_uploaded_file($_FILES['photo']['tmp_name'], $target)) {
        $fields[] = 'photo = :photo';
        $params[':photo'] = $filename; // Only filename in DB
    }
}

if (count($fields) === 0) {
    echo json_encode(['status' => 'error', 'message' => 'No data to update']);
    exit;
}

$sql = "UPDATE $table SET " . implode(', ', $fields) . " WHERE $idField = :id";
$params[':id'] = $userId;
$stmt = $conn->prepare($sql);
$stmt->execute($params);

$stmt = $conn->prepare("SELECT username, email, phone_number, photo FROM $table WHERE $idField = :id");
$stmt->bindValue(':id', $userId, PDO::PARAM_INT);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$photoUrl = '';
if (!empty($user['photo'])) {
    $photoUrl = 'http://localhost/Backend/' . $user['photo'];
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
