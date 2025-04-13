<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include 'db_conn.php';

$response = [];

if (
    isset($_POST['service_id']) &&
    isset($_POST['service_name']) &&
    isset($_POST['category']) &&
    isset($_POST['price']) &&
    isset($_POST['duration']) &&
    isset($_POST['description'])
) {
    $service_id = intval($_POST['service_id']);
    $service_name = $_POST['service_name'];
    $category = $_POST['category'];
    $price = floatval($_POST['price']);
    $duration = $_POST['duration'];
    $description = $_POST['description'];

    try {
        if (isset($_FILES['image'])) {
            $image = $_FILES['image'];
            $image_name = time() . "_" . basename($image["name"]);
            $upload_dir = "uploads/services/";

            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $upload_path = $upload_dir . $image_name;

            if (move_uploaded_file($image["tmp_name"], $upload_path)) {
                $stmt = $conn->prepare("UPDATE services 
                    SET service_name = ?, category = ?, price = ?, duration = ?, description = ?, image = ? 
                    WHERE service_id = ?");
                $stmt->execute([$service_name, $category, $price, $duration, $description, $image_name, $service_id]);
            } else {
                echo json_encode(["status" => false, "message" => "Image upload failed"]);
                exit;
            }
        } else {
            $stmt = $conn->prepare("UPDATE services 
                SET service_name = ?, category = ?, price = ?, duration = ?, description = ? 
                WHERE service_id = ?");
            $stmt->execute([$service_name, $category, $price, $duration, $description, $service_id]);
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

header("Content-Type: application/json");
echo json_encode($response);
?>
