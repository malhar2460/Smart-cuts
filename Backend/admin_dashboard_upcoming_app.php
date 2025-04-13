<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");

include 'db_conn.php';

$admin_id = isset($_GET['admin_id']) ? intval($_GET['admin_id']) : 0;

if ($admin_id == 0) {
    echo json_encode(["status" => false, "message" => "Admin ID is required"]);
    exit;
}

$today = date('Y-m-d');


try {

    $stmt = $conn->prepare("SELECT a.appointment_id, c.username AS customer_name, s.service_name, a.appointment_date, a.status
                            FROM appointment a
                            JOIN customer c ON a.customer_id = c.customer_id
                            JOIN services s ON a.service_id = s.service_id
                            WHERE a.admin_id = ? AND DATE(a.appointment_date) > ?");
    $stmt->execute([$admin_id, $today]);
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    print_r($appointments);
    if ($appointments) {
        echo json_encode([
            "status" => true,
            "data" => $appointments
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "No upcoming appointments found."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
