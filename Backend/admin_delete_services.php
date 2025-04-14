<?php
session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_conn.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => false, "message" => "Method not allowed"]);
    exit;
}

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["status" => false, "message" => "Admin not logged in"]);
    exit;
}

$admin_id = $_SESSION['admin_id'];
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['service_id'])) {
    echo json_encode(["status" => false, "message" => "Service ID is required"]);
    exit;
}

$service_id = intval($data['service_id']);

try {
    $stmt1 = $conn->prepare("SELECT salon_id FROM salon WHERE admin_id = ?");
    $stmt1->execute([$admin_id]);
    $salon = $stmt1->fetch(PDO::FETCH_ASSOC);

    if (!$salon) {
        echo json_encode(["status" => false, "message" => "Salon not found for this admin"]);
        exit;
    }

    $salon_id = $salon['salon_id'];

    $stmt2 = $conn->prepare("SELECT * FROM services WHERE service_id = ? AND salon_id = ?");
    $stmt2->execute([$service_id, $salon_id]);
    $service = $stmt2->fetch(PDO::FETCH_ASSOC);

    if (!$service) {
        echo json_encode(["status" => false, "message" => "Service not found for this salon"]);
        exit;
    }

    $stmt3 = $conn->prepare("DELETE FROM services WHERE service_id = ? AND salon_id = ?");
    $stmt3->execute([$service_id, $salon_id]);

    if ($stmt3->rowCount() > 0) {
        echo json_encode(["status" => true, "message" => "Service deleted successfully"]);
    } else {
        echo json_encode(["status" => false, "message" => "Failed to delete service"]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
