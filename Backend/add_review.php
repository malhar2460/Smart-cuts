<?php
// add_review.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require 'db_conn.php';

// parse JSON body
$input = json_decode(file_get_contents('php://input'), true);
$salon_id    = isset($input['salon_id'])    ? intval($input['salon_id'])    : 0;
$customer_id = isset($input['customer_id']) ? intval($input['customer_id']) : 0;
$rating      = isset($input['rating'])      ? intval($input['rating'])      : 0;
$comment     = isset($input['comment'])     ? trim($input['comment'])       : '';

if (!$salon_id || !$customer_id || $rating < 1 || $rating > 5 || $comment === '') {
    echo json_encode([
        "status"  => false,
        "message" => "salon_id, customer_id, rating (1–5) and comment are all required"
    ]);
    exit;
}

try {
    $stmt = $conn->prepare("
        INSERT INTO review
          (salon_id, customer_id, rating, review_text, created_at)
        VALUES
          (?, ?, ?, ?, NOW())
    ");
    $ok = $stmt->execute([$salon_id, $customer_id, $rating, $comment]);

    if ($ok) {
        echo json_encode([
            "status"    => true,
            "review_id" => $conn->lastInsertId()
        ]);
    } else {
        echo json_encode([
            "status"  => false,
            "message" => "Failed to insert review"
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "status"  => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
