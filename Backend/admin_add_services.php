<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'db_conn.php';

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Must be logged in
// if (!isset($_SESSION['admin_id'])) {
//     echo json_encode(["success" => false, "message" => "Admin not logged in"]);
//     exit;
// }

$input = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (
    empty($input['service_name']) ||
    empty($input['category']) ||
    !isset($input['price']) ||
    !isset($input['duration']) ||
    empty($input['description'])
) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

$service_name = trim($input['service_name']);
$category     = trim($input['category']);
$price        = floatval($input['price']);
$duration     = intval($input['duration']);
$description  = trim($input['description']);
$admin_id     = $input['admin_id'];

// Lookup this admin's salon_id
$stmt = $conn->prepare("SELECT salon_id FROM salon WHERE admin_id = ?");
$stmt->execute([$admin_id]);
$salon = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$salon) {
    echo json_encode(["success" => false, "message" => "Salon not found for this admin"]);
    exit;
}

$salon_id = $salon['salon_id'];

try {
    $insert = $conn->prepare("
        INSERT INTO services
          (service_name, category, price, duration, description, salon_id)
        VALUES
          (?, ?, ?, ?, ?, ?)
    ");
    $insert->execute([
        $service_name,
        $category,
        $price,
        $duration,
        $description,
        $salon_id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Service added successfully"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
