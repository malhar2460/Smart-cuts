<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");

include 'db_conn.php';

$staff_id = isset($_GET['staff_id']) ? intval($_GET['staff_id']) : 0;
if ($staff_id <= 0) {
    echo json_encode([
        "status"  => false,
        "message" => "staff_id is required"
    ]);
    exit;
}

try {
    // 1) Total appointments for this staff
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS total
        FROM appointment
        WHERE staff_id = ?
    ");
    $stmt->execute([$staff_id]);
    $total = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // 2) Pending appointments
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS pending
        FROM appointment
        WHERE staff_id = ?
          AND status = 'pending'
    ");
    $stmt->execute([$staff_id]);
    $pending = (int)$stmt->fetch(PDO::FETCH_ASSOC)['pending'];

    // 3) Confirmed appointments
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS confirmed
        FROM appointment
        WHERE staff_id = ?
          AND status = 'confirmed'
    ");
    $stmt->execute([$staff_id]);
    $confirmed = (int)$stmt->fetch(PDO::FETCH_ASSOC)['confirmed'];

    echo json_encode([
        "status" => true,
        "data"   => [
            "total"     => $total,
            "pending"   => $pending,
            "confirmed" => $confirmed
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status"  => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
