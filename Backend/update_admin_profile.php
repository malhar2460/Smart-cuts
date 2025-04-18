<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Include DB connection
include_once("db_conn.php"); // should define a PDO object $conn

// Make sure the uploads directory exists
$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Grab POST fields
$admin_id = $_POST['admin_id'] ?? null;
$name     = $_POST['name']     ?? null;
$email    = $_POST['email']    ?? null;
$phone    = $_POST['phone']    ?? null;

if (!$admin_id || !$name || !$email || !$phone) {
    echo json_encode([
        "status"  => false,
        "message" => "Missing required fields."
    ]);
    exit;
}

// Prepare to build the SQL
$fieldsToUpdate = [
    'username = ?',
    'email    = ?',
    'phone_number    = ?'
];
$params = [$name, $email, $phone, $admin_id];

// Handle optional file upload
if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === UPLOAD_ERR_OK) {
    $tmpPath = $_FILES['profile_pic']['tmp_name'];
    $origName = basename($_FILES['profile_pic']['name']);
    $ext = pathinfo($origName, PATHINFO_EXTENSION);
    // Create a unique filename, e.g. "5_abcdef12345.jpg"
    $newFilename = $admin_id . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $destPath = $uploadDir . $newFilename;
    if (move_uploaded_file($tmpPath, $destPath)) {
        // add profile_pic to the update
        $fieldsToUpdate[] = "photo = ?";
        // store the web‐accessible path
        $webPath = "uploads/" . $newFilename;
        // insert it before the admin_id param
        array_splice($params, 3, 0, $webPath);
    } else {
        echo json_encode([
            "status"  => false,
            "message" => "Failed to save uploaded file."
        ]);
        exit;
    }
}

try {
    $sql = "UPDATE admin SET " . implode(', ', $fieldsToUpdate) . " WHERE admin_id = ?";
    $stmt = $conn->prepare($sql);
    $success = $stmt->execute($params);

    if ($success) {
        echo json_encode([
            "status"  => true,
            "message" => "Profile updated successfully."
        ]);
    } else {
        echo json_encode([
            "status"  => false,
            "message" => "Failed to update profile."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "status"  => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
