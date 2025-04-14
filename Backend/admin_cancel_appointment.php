<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_conn.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['appointment_id'])) {
    echo json_encode(["status" => false, "message" => "Appointment ID is required"]);
    exit;
}

$appointment_id = intval($data['appointment_id']);

try {
    // Possibly mark it canceled rather than deleting
    // For demonstration, we’ll just delete
    $stmt = $conn->prepare("DELETE FROM appointments WHERE appointment_id = ?");
    $stmt->execute([$appointment_id]);

    echo json_encode([
        "status" => true,
        "message" => "Appointment canceled"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
