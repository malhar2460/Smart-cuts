<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/db_conn.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['appointment_id']) || !isset($data['new_datetime'])) {
    http_response_code(400);
    echo json_encode(["status" => false, "message" => "Missing required fields"]);
    exit;
}

try {
    $conn->beginTransaction();

    // Verify salon ownership
    $stmt = $conn->prepare("
        SELECT s.salon_id 
        FROM appointment a
        JOIN staff s ON a.staff_id = s.staff_id
        WHERE a.appointment_id = :id
    ");
    $stmt->execute([':id' => $data['appointment_id']]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result || $result['salon_id'] != $_GET['salon_id']) {
        http_response_code(403);
        echo json_encode(["status" => false, "message" => "Unauthorized access"]);
        exit;
    }

    // Update appointment
    $stmt = $conn->prepare("
        UPDATE appointment 
        SET appointment_date = :new_datetime
        WHERE appointment_id = :id
    ");
    $stmt->execute([
        ':new_datetime' => date('Y-m-d H:i:s', strtotime($data['new_datetime'])),
        ':id' => $data['appointment_id']
    ]);

    $conn->commit();
    echo json_encode(["status" => true, "message" => "Appointment rescheduled successfully"]);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(["status" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>