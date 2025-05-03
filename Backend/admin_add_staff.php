<?php
// Backend: admin_add_staff.php

session_start();
require 'db_conn.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

// 1) Only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => false, "message" => "Method not allowed."]);
    exit;
}

// 2) Extract fields
$admin_id       = $_POST['admin_id']      ?? '';
$salon_id       = $_POST['salon_id']      ?? '';
$username     = trim($_POST['staff_name'] ?? '');
$specialization = trim($_POST['specialization'] ?? '');
$phone_number   = trim($_POST['phone_number'] ?? '');
$email          = trim($_POST['email'] ?? '');
$availability   = trim(strtolower($_POST['availability'] ?? ''));
$password       = $_POST['password']      ?? '';

// 3) Validate
if (
    $admin_id === '' || $salon_id === '' || $username === '' ||
    $specialization === '' || $phone_number === '' || $email === '' ||
    $availability === '' || $password === '' || empty($_FILES['image'])
) {
    echo json_encode(["status" => false, "message" => "All fields including image are required."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => false, "message" => "Invalid email address."]);
    exit;
}

if (!in_array($availability, ['available', 'unavailable'], true)) {
    echo json_encode(["status" => false, "message" => "Availability must be 'available' or 'unavailable'."]);
    exit;
}

// 4) Handle file upload
$photo       = $_FILES['image'];
$filename    = time() . "_" . basename($photo["name"]);
$upload_dir  = __DIR__ . "/uploads/staff";
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}
$target_path = $upload_dir . $filename;

if (!move_uploaded_file($photo["tmp_name"], $target_path)) {
    echo json_encode(["status" => false, "message" => "Failed to upload photo."]);
    exit;
}

// 5) Insert into DB — prefix "../" so it matches your existing entries
try {
    $hashed = password_hash($password, PASSWORD_BCRYPT);
    $sql = "
      INSERT INTO staff 
        (salon_id, username, specialization, phone_number, email, availability, password, photo)
      VALUES
        (:sid, :name, :spec, :phone, :email, :avail, :pwd, :img)
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':sid'   => $salon_id,
        ':name'  => $username,
        ':spec'  => $specialization,
        ':phone' => $phone_number,
        ':email' => $email,
        ':avail' => $availability,
        ':pwd'   => $hashed,
        // ← store exactly "../filename.ext" so your frontend logic stays the same
        ':img'   => "../" . $filename,
    ]);

    echo json_encode(["status" => true, "message" => "Staff member added successfully."]);
} catch (PDOException $e) {
    echo json_encode(["status" => false, "message" => "Database error: " . $e->getMessage()]);
}
