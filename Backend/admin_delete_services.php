<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

include 'db_conn.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['service_id'])) {
    echo json_encode(["status" => false, "message" => "Service ID is required"]);
    exit;
}

$service_id = intval($data['service_id']);

try {
    $stmt = $conn->prepare("DELETE FROM services WHERE service_id = ?");
    $stmt->execute([$service_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => true, "message" => "Service deleted successfully"]);
    } else {
        echo json_encode(["status" => false, "message" => "Service not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
