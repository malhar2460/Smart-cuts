<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");

include 'db_conn.php';

// Get salon_id from query string (e.g., ?salon_id=1)
$salon_id = isset($_GET['salon_id']) ? intval($_GET['salon_id']) : 0;

if ($salon_id == 0) {
    echo json_encode(["status" => false, "message" => "Salon ID is required"]);
    exit;
}

// Fetch recent reviews for the given salon_id
try {
    // 1. Recent Reviews for the given salon_id (limit 5 for example)
    $stmt = $conn->prepare("SELECT r.review_id, r.rating, r.review_text, r.created_at, c.username AS customer_name, s.service_name
                            FROM review r
                            JOIN customer c ON r.customer_id = c.customer_id
                            JOIN services s ON r.service_id = s.service_id
                            WHERE r.salon_id = ? 
                            ORDER BY r.created_at DESC
                            LIMIT 5");
    $stmt->execute([$salon_id]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($reviews) {
        echo json_encode([
            "status" => true,
            "data" => $reviews
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "No recent reviews found."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
