<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'db_conn.php';

$response = [];

if (!isset($_POST['admin_id'])) {
    echo json_encode(["status" => false, "message" => "Admin not logged in"]);
    exit;
}

$admin_id = $_POST['admin_id'];

if (
    isset($_POST['service_id']) &&
    isset($_POST['service_name']) &&
    isset($_POST['category']) &&
    isset($_POST['price']) &&
    isset($_POST['duration']) &&
    isset($_POST['description'])
) {
    $service_id   = intval($_POST['service_id']);
    $service_name = $_POST['service_name'];
    $category     = $_POST['category'];
    $price        = floatval($_POST['price']);
    $duration     = $_POST['duration'];
    $description  = $_POST['description'];

    try {
        $stmt1 = $conn->prepare("SELECT salon_id FROM salon WHERE admin_id = ?");
        $stmt1->execute([$admin_id]);
        $salon = $stmt1->fetch(PDO::FETCH_ASSOC);

        if (!$salon) {
            echo json_encode(["status" => false, "message" => "Salon not found for this admin"]);
            exit;
        }

        $salon_id = $salon['salon_id'];

        $stmt2 = $conn->prepare("SELECT * FROM services WHERE service_id = ? AND salon_id = ?");
        $stmt2->execute([$service_id, $salon_id]);
        $existingService = $stmt2->fetch(PDO::FETCH_ASSOC);

        if (!$existingService) {
            echo json_encode(["status" => false, "message" => "Service not found for this salon"]);
            exit;
        }

        if (isset($_FILES['image'])) {
            $image = $_FILES['image'];
            $image_name = time() . "_" . basename($image["name"]);
            $upload_dir = "uploads/";

            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $upload_path = $upload_dir . $image_name;

            if (move_uploaded_file($image["tmp_name"], $upload_path)) {
                $stmt3 = $conn->prepare("UPDATE services 
                    SET service_name = ?, category = ?, price = ?, duration = ?, description = ?, image = ? 
                    WHERE service_id = ? AND salon_id = ?");
                $stmt3->execute([$service_name, $category, $price, $duration, $description, $image_name, $service_id, $salon_id]);
            } else {
                echo json_encode(["status" => false, "message" => "Image upload failed"]);
                exit;
            }
        } else {
            
            $stmt3 = $conn->prepare("UPDATE services 
                SET service_name = ?, category = ?, price = ?, duration = ?, description = ? 
                WHERE service_id = ? AND salon_id = ?");
            $stmt3->execute([$service_name, $category, $price, $duration, $description, $service_id, $salon_id]);
        }

        $response = [
            "status" => true,
            "message" => "Service updated successfully"
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
        "message" => "Missing required fields"
    ];
}

echo json_encode($response);
