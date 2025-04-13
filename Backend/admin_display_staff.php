<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");

include 'db_conn.php';

$salon_id = isset($_GET['salon_id']) ? intval($_GET['salon_id']) : 0;

if ($salon_id == 0) {
    echo json_encode(["status" => false, "message" => "Salon ID is required"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT staff_id, staff_name, specialization, phone_number, email, availability 
                            FROM staff 
                            WHERE salon_id = ?");
    $stmt->execute([$salon_id]);
    $staffList = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($staffList) {
        echo json_encode([
            "status" => true,
            "data" => $staffList
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "No staff found for this salon."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
