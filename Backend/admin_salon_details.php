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
    $stmt = $conn->prepare("SELECT * FROM salon WHERE salon_id = ?");
    $stmt->execute([$salon_id]);
    $salon = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($salon) {
        echo json_encode([
            "status" => true,
            "data" => $salon
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Salon not found"
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
