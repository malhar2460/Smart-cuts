<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include 'db_conn.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Read the raw input stream and decode the JSON data
    $input = json_decode(file_get_contents("php://input"), true);

    // Retrieve values from decoded JSON
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    $email = $input['email'] ?? '';
    $phone_number = $input['phone_number'] ?? '';
    $created_at = date('Y-m-d H:i:s');  // Get the current timestamp for created_at

    // Basic validation to check if all fields are provided
    if (!empty($username) && !empty($password) && !empty($email) && !empty($phone_number)) {
        try {
            // Check if a user with the provided email already exists
            $stmt = $conn->prepare("SELECT * FROM customer WHERE email = ?");
            $stmt->execute([$email]);
            $existingUser = $stmt->fetch();

            if ($existingUser) {
                echo json_encode(['status' => 'error', 'message' => 'User with this email already exists.']);
            } else {
                // Hash the password for security
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

                // Insert the new user
                $stmt = $conn->prepare("INSERT INTO customer (username, password, email, phone_number, created_at) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$username, $hashedPassword, $email, $phone_number, $created_at]);

                echo json_encode(['status' => 'success', 'message' => 'Registration successful.']);
            }
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Registration failed. Error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}

