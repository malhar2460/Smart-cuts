<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include 'db_conn.php';

$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (
    !isset($data['staff_name']) || 
    !isset($data['specialization']) || 
    !isset($data['phone_number']) || 
    !isset($data['email']) || 
    !isset($data['availability']) || 
    !isset($data['salon_id'])
) {
    echo json_encode(["status" => false, "message" => "All fields are required"]);
    exit;
}

$staff_name = $data['staff_name'];
$specialization = $data['specialization'];
$phone_number = $data['phone_number'];
$email = $data['email'];
$availability = $data['availability'];
$salon_id = intval($data['salon_id']);

try {
    $stmt = $conn->prepare("INSERT INTO staff (staff_name, specialization, phone_number, email, availability, salon_id) 
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$staff_name, $specialization, $phone_number, $email, $availability, $salon_id]);

    echo json_encode([
        "status" => true,
        "message" => "Staff member added successfully"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
