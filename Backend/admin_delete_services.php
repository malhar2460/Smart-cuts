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
// if (!isset($input['admin_id'])) {
//     echo json_encode(["success" => false, "message" => "Admin not logged in"]);
//     exit;
// }

$input = json_decode(file_get_contents("php://input"), true);

// service_id required
if (empty($input['service_id'])) {
    echo json_encode(["success" => false, "message" => "Service ID is required"]);
    exit;
}

$service_id = intval($input['service_id']);
$admin_id   = $input['admin_id'];

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
    // Ensure service belongs to this salon
    $check = $conn->prepare("
      SELECT 1 FROM services 
      WHERE service_id = ? AND salon_id = ?
    ");
    $check->execute([$service_id, $salon_id]);

    if (!$check->fetch()) {
        echo json_encode(["success" => false, "message" => "Service not found"]);
        exit;
    }

    // Delete
    $del = $conn->prepare("
      DELETE FROM services 
      WHERE service_id = ? AND salon_id = ?
    ");
    $del->execute([$service_id, $salon_id]);

    if ($del->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Service deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete service"]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
