<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_conn.php';

// We no longer require $_POST['password'] here
if (
    isset($_POST['staff_id']) &&
    isset($_POST['staff_name']) &&
    isset($_POST['specialization']) &&
    isset($_POST['phone_number']) &&
    isset($_POST['email']) &&
    isset($_POST['availability'])
) {
    $staff_id       = intval($_POST['staff_id']);
    $username     = trim($_POST['staff_name']);
    $raw_password   = trim($_POST['password'] ?? '');
    $specialization = trim($_POST['specialization']);
    $phone_number   = trim($_POST['phone_number']);
    $email          = trim($_POST['email']);
    $availability   = trim($_POST['availability']);

    try {
        // Build base SQL and params
        $params = [
            $username,
            $specialization,
            $phone_number,
            $email,
            $availability,
        ];
        $sql = "UPDATE staff SET 
                    username   = ?, 
                    specialization= ?, 
                    phone_number = ?, 
                    email        = ?, 
                    availability = ?";

        // If a new password was provided, hash it & include in UPDATE
        if ($raw_password !== '') {
            $hashed = password_hash($raw_password, PASSWORD_BCRYPT);
            $sql .= ", password = ?";
            $params[] = $hashed;
        }

        // If an image file was uploaded, handle it & include in UPDATE
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $photo      = $_FILES['image'];
            $photo_name = time() . "_" . basename($photo["name"]);
            $upload_dir = "uploads/staff/";

            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            $upload_path = $upload_dir . $photo_name;

            if (!move_uploaded_file($photo["tmp_name"], $upload_path)) {
                echo json_encode(["status" => false, "message" => "photo upload failed"]);
                exit;
            }

            $sql .= ", photo = ?";
            $params[] = $photo_name;
        }

        // Finish SQL with WHERE and staff_id
        $sql .= " WHERE staff_id = ?";
        $params[] = $staff_id;

        // Prepare & execute
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);

        echo json_encode(["status" => true, "message" => "Staff updated successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => false, "message" => "Missing required fields"]);
}
?>
