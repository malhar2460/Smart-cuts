<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
include 'db_conn.php';

// Validate & grab the admin_id
$admin_id = filter_input(INPUT_GET, 'admin_id', FILTER_VALIDATE_INT);
if (!$admin_id) {
    http_response_code(400);
    echo json_encode([
        'status'  => false,
        'message' => 'A valid admin_id is required'
    ]);
    exit();
}

try {
    // Fetch the admin record
    $stmt = $conn->prepare("
        SELECT username, email, phone_number, photo
          FROM admin
         WHERE admin_id = :id
        LIMIT 1
    ");
    $stmt->bindParam(':id', $admin_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($admin = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Build the response
        // If your `photo` column is just a filename, you might prefix it with your uploads path:
        //   $profilePic = '/uploads/' . basename($admin['photo']);
        $profilePic = $admin['photo'];

        echo json_encode([
            'status' => true,
            'data'   => [
                'name'        => $admin['username'],
                'email'       => $admin['email'],
                'phone'       => $admin['phone_number'],
                'role'        => 'Admin',
                'profile_pic' => $profilePic
            ]
        ]);
    } else {
        // No such admin
        http_response_code(404);
        echo json_encode([
            'status'  => false,
            'message' => 'Admin not found'
        ]);
    }
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => false,
        'message' => 'Database error'
    ]);
}

$conn = null;
