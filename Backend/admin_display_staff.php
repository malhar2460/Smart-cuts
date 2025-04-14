<?php

session_start(); 

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");

include 'db_conn.php';

if (!isset($_SESSION['admin_id']) || !isset($_SESSION['salon_id'])) {
    echo json_encode(["status" => false, "message" => "Admin is not logged in or salon ID is not found in session."]);
    exit;
}

$salon_id = $_SESSION['salon_id'];

try {
    $stmt = $conn->prepare("SELECT staff_id, staff_name, specialization, phone_number, email, availability,image 
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
