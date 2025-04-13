<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once 'db_conn.php'; 

$data = json_decode(file_get_contents("php://input"));

$admin = $data->admin;
$salon = $data->salon;

if (
    empty($admin->username) || empty($admin->password) || empty($admin->email) || empty($admin->phone_number) ||
    empty($salon->salon_name) || empty($salon->location) || empty($salon->contact) ||
    empty($salon->description) || empty($salon->image)
) {
    echo json_encode(["status" => false, "message" => "All fields are required."]);
    exit;
}

$username = $admin->username;
$password = password_hash($admin->password, PASSWORD_BCRYPT);
$email = $admin->email;
$phone_number = $admin->phone_number;
$created_at = date('Y-m-d H:i:s');

$salon_name = $salon->salon_name;
$location = $salon->location;
$contact = $salon->contact;
$description = $salon->description;
$image = $salon->image;

try {
    $checkQuery = "SELECT * FROM admin WHERE username = :username OR email = :email";
    $stmt = $conn->prepare($checkQuery);
    $stmt->execute(['username' => $username, 'email' => $email]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => false, "message" => "Username or email already exists."]);
        exit;
    }

    $conn->beginTransaction();

    $adminInsert = "INSERT INTO admin (username, password, email, phone_number, created_at) VALUES (:username, :password, :email, :phone_number, :created_at)";
    $stmt = $conn->prepare($adminInsert);
    $stmt->execute([
        'username' => $username,
        'password' => $password,
        'email' => $email,
        'phone_number' => $phone_number,
        'created_at' => $created_at
    ]);
    $admin_id = $conn->lastInsertId();

    $salonInsert = "INSERT INTO salon (salon_name, location, contact, admin_id, description, image) VALUES (:salon_name, :location, :contact, :admin_id, :description, :image)";
    $stmt = $conn->prepare($salonInsert);
    $stmt->execute([
        'salon_name' => $salon_name,
        'location' => $location,
        'contact' => $contact,
        'admin_id' => $admin_id,
        'description' => $description,
        'image' => $image
    ]);

    $salon_id = $conn->lastInsertId();
    $conn->commit();

    echo json_encode([
        "status" => true,
        "message" => "Admin and Salon registered successfully.",
        "admin_id" => $admin_id,
        "salon_id" => $salon_id
    ]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["status" => false, "message" => "Registration failed: " . $e->getMessage()]);
}
?>