<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");

include 'db_conn.php';

$salon_id = isset($_GET['salon_id']) ? intval($_GET['salon_id']) : 0;

if ($salon_id === 0) {
    echo json_encode(["status" => false, "message" => "Salon ID is required"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT service_id, service_name, category, price, duration, description 
                            FROM services 
                            WHERE salon_id = ?");
    $stmt->execute([$salon_id]);
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($services) {
        echo json_encode([
            "status" => true,
            "data" => $services
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "No services found for this salon"
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
