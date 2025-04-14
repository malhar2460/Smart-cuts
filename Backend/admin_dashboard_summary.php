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
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM appointment WHERE DATE(appointment_date) = ? AND admin_id = ?");
    $stmt->execute([$today, $admin_id]);
    $appointments = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    $stmt = $conn->prepare("
        SELECT SUM(p.amount) as total 
        FROM payment p 
        JOIN appointment a ON p.appointment_id = a.appointment_id 
        WHERE DATE(p.payment_date) = ? AND a.admin_id = ?
    ");
    $stmt->execute([$today, $admin_id]);
    $revenue = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM customer WHERE DATE(created_at) = ?");
    $stmt->execute([$today]);
    $new_customers = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    $stmt = $conn->prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM review");
    $stmt->execute();
    $review_data = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => true,
        "data" => [
            "todays_appointments" => (int)$appointments,
            "revenue_today" => (float)$revenue,
            "new_customers" => (int)$new_customers,
            "average_rating" => round($review_data['avg_rating'], 1),
            "total_reviews" => (int)$review_data['total_reviews']
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
