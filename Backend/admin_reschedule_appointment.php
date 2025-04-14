<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_conn.php';

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['appointment_id']) ||
    !isset($data['new_date_time'])
) {
    echo json_encode(["status" => false, "message" => "Missing appointment ID or new date/time"]);
    exit;
}

$appointment_id = intval($data['appointment_id']);
$new_date_time = $data['new_date_time']; // e.g. "2025-03-15 14:30:00"

try {
    $stmt = $conn->prepare("
        UPDATE appointments 
        SET date_time = ? 
        WHERE appointment_id = ?
    ");
    $stmt->execute([$new_date_time, $appointment_id]);

    echo json_encode([
        "status" => true,
        "message" => "Appointment rescheduled successfully"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
