<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

include 'db_conn.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['staff_id'])) {
    echo json_encode(["status" => false, "message" => "Staff ID is required"]);
    exit;
}

$staff_id = intval($data['staff_id']);

try {
    $stmt = $conn->prepare("DELETE FROM staff WHERE staff_id = ?");
    $stmt->execute([$staff_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => true, "message" => "Staff deleted successfully"]);
    } else {
        echo json_encode(["status" => false, "message" => "Staff not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
