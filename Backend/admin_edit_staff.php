<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_conn.php';

$response = [];

if (
    isset($_POST['staff_id']) &&
    isset($_POST['staff_name']) &&
    isset($_POST['specialization']) &&
    isset($_POST['phone_number']) &&
    isset($_POST['email']) &&
    isset($_POST['availability'])
) {

    $staff_id = intval($_POST['staff_id']);
    $staff_name = $_POST['staff_name'];
    $specialization = $_POST['specialization'];
    $phone_number = $_POST['phone_number'];
    $email = $_POST['email'];
    $availability = $_POST['availability'];

    try {
  
        if (isset($_FILES['image'])) {
            $image = $_FILES['image'];
            $image_name = time() . "_" . basename($image["name"]);
            $upload_dir = "uploads/staff/";

            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $upload_path = $upload_dir . $image_name;

            if (move_uploaded_file($image["tmp_name"], $upload_path)) {

                $stmt = $conn->prepare("UPDATE staff 
                    SET staff_name = ?, specialization = ?, phone_number = ?, email = ?, availability = ?, image = ? 
                    WHERE staff_id = ?");
                $stmt->execute([$staff_name, $specialization, $phone_number, $email, $availability, $image_name, $staff_id]);
            } else {
                echo json_encode(["status" => false, "message" => "Image upload failed"]);
                exit;
            }
        } else {

            $stmt = $conn->prepare("UPDATE staff 
                SET staff_name = ?, specialization = ?, phone_number = ?, email = ?, availability = ? 
                WHERE staff_id = ?");
            $stmt->execute([$staff_name, $specialization, $phone_number, $email, $availability, $staff_id]);
        }

        $response = [
            "status" => true,
            "message" => "Staff updated successfully"
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
