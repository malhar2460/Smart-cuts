<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include 'db_conn.php';

$response = [];

if (
    isset($_POST['service_name']) &&
    isset($_POST['category']) &&
    isset($_POST['price']) &&
    isset($_POST['duration']) &&
    isset($_POST['description']) &&
    isset($_POST['salon_id']) &&
    isset($_FILES['image'])
) {
    $service_name = $_POST['service_name'];
    $category = $_POST['category'];
    $price = floatval($_POST['price']);
    $duration = $_POST['duration'];
    $description = $_POST['description'];
    $salon_id = intval($_POST['salon_id']);

    $image = $_FILES['image'];
    $image_name = time() . "_" . basename($image["name"]);
    $upload_dir = "uploads/services/";

    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $upload_path = $upload_dir . $image_name;

    if (move_uploaded_file($image["tmp_name"], $upload_path)) {
        try {
            $stmt = $conn->prepare("INSERT INTO services (service_name, category, price, duration, description, image, salon_id) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$service_name, $category, $price, $duration, $description, $image_name, $salon_id]);

            $response = [
                "status" => true,
                "message" => "Service added successfully with image",
                "image_url" => $upload_path
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
            "message" => "Failed to upload image"
        ];
    }
} else {
    $response = [
        "status" => false,
        "message" => "All fields including image are required"
    ];
}

header("Content-Type: application/json");
echo json_encode($response);
?>
