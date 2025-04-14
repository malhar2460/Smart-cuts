<?php

session_start();

require 'db_conn.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    if (empty($_SESSION['admin_id'])) 
    {
        echo json_encode(["status" => "error", "message" => "Admin not logged in."]);
        exit;
    }

    $admin_id = $_SESSION['admin_id'];
    $data = json_decode(file_get_contents("php://input"), true);

    $staff_name     = isset($data['staff_name']) ? trim($data['staff_name']) : '';
    $specialization = isset($data['specialization']) ? trim($data['specialization']) : '';
    $phone_number   = isset($data['phone_number']) ? trim($data['phone_number']) : '';
    $email          = isset($data['email']) ? trim($data['email']) : '';
    $availability   = isset($data['availability']) ? strtolower(trim($data['availability'])) : '';
    $image          = isset($data['image']) ? trim($data['image']) : '';

    // Check for missing fields
    if (
        empty($staff_name) || empty($specialization) || empty($phone_number) ||
        empty($email) || empty($availability) || empty($image)
    ) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit;
    }

    // Validate availability
    $valid_availability_options = ['available', 'unavailable'];
    if (!in_array($availability, $valid_availability_options)) {
        echo json_encode(["status" => "error", "message" => "Invalid option. Use 'available' or 'unavailable'."]);
        exit;
    }

    // Get salon_id from admin_id
    $stmt1 = $conn->prepare("SELECT salon_id FROM salon WHERE admin_id = ?");
    $stmt1->execute([$admin_id]);
    $salon = $stmt1->fetch(PDO::FETCH_ASSOC);

    if (!$salon || !isset($salon['salon_id'])) {
        echo json_encode(["status" => "error", "message" => "Salon not found for this admin."]);
        exit;
    }

    $salon_id = $salon['salon_id'];

    try {
        $stmt = $conn->prepare("
            INSERT INTO staff (staff_name, specialization, phone_number, email, availability, salon_id, image)
            VALUES (:staff_name, :specialization, :phone_number, :email, :availability, :salon_id, :image)
        ");

        $stmt->bindValue(':staff_name', $staff_name);
        $stmt->bindValue(':specialization', $specialization);
        $stmt->bindValue(':phone_number', $phone_number);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':availability', $availability);
        $stmt->bindValue(':salon_id', $salon_id);
        $stmt->bindValue(':image', $image);

        $stmt->execute();

        echo json_encode(["status" => "success", "message" => "Staff member added successfully."]);
    } 
    catch (PDOException $e) 
    {
        echo json_encode([
            "status" => "error", 
            "message" => "Database error: " . $e->getMessage()
        ]);
    }
} 
else 
{
    echo json_encode(["status" => "error", "message" => "Method not allowed."]);
}
