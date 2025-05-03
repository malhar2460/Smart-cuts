<?php
// admin_display_staff.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET,OPTIONS");

require_once __DIR__ . '/db_conn.php';

// Allow preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 1) Read salon_id from GET
$salon_id = isset($_GET['salon_id']) ? intval($_GET['salon_id']) : 0;
if ($salon_id <= 0) {
    echo json_encode([
        "status"  => false,
        "message" => "Missing or invalid salon_id parameter."
    ]);
    exit;
}

try {
    // 2) Fetch all staff for this salon_id
    $stmt = $conn->prepare(
        "SELECT staff_id,
                username,
                password,
                specialization,
                phone_number,
                email,
                availability,
                photo
         FROM staff
         WHERE salon_id = :sid"
    );
    $stmt->execute([':sid' => $salon_id]);
    $staffList = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($staffList) > 0) {
        echo json_encode([
            "status" => true,
            "data"   => $staffList
        ]);
    } else {
        echo json_encode([
            "status"  => false,
            "message" => "No staff found for salon_id {$salon_id}."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "status"  => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
