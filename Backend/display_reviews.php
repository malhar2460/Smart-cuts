<?php
// display_reviews.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require 'db_conn.php';

$salon_id = isset($_GET['salon_id']) ? intval($_GET['salon_id']) : 0;
if ($salon_id <= 0) {
    echo json_encode([
        "status"  => false,
        "message" => "salon_id is required"
    ]);
    exit;
}

try {
    // join review → customer to get commenter’s name
    $stmt = $conn->prepare("
        SELECT 
          r.review_id,
          r.rating,
          r.review_text,
          c.username AS customer_name,
          r.created_at
        FROM review r
        JOIN customer c ON r.customer_id = c.customer_id
        WHERE r.salon_id = :sid
        ORDER BY r.created_at DESC
    ");
    $stmt->execute([':sid' => $salon_id]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => true,
        "data"   => $reviews
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status"  => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
