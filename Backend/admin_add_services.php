<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'db_conn.php';

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->service_name) && !empty($data->category) &&
    !empty($data->price) && !empty($data->duration) &&
    !empty($data->description) &&
    !empty($data->image) 
) {
    $service_name = $data->service_name;
    $category = $data->category;
    $price = floatval($data->price);
    $duration = $data->duration;
    $description = $data->description;
    $admin_id = $_SESSION['admin_id'];
    $image = $data->image;

    $stmt1 = $conn->prepare("SELECT salon_id FROM salon WHERE admin_id = ?");
    $stmt1->execute([$admin_id]);
    $salon = $stmt1->fetch(PDO::FETCH_ASSOC);

    $salon_id = $salon['salon_id'];

    try {
        $stmt = $conn->prepare("INSERT INTO services (service_name, category, price, duration, description, image, salon_id) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$service_name, $category, $price, $duration, $description, $image, $salon_id]);

        $response = [
            "status" => true,
            "message" => "Service added successfully ",
        ];
    } catch (PDOException $e) {
        $response = [
            "status" => false,
            "message" => "Database error: " . $e->getMessage()
        ];
    }

} else {
    $response = [
        "status" => false,
        "message" => "All fields including image are required"
    ];
}

?>
