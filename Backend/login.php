<?php
require 'db_conn.php';  // Database connection
require 'vendor/autoload.php';  // JWT package autoloader

use Firebase\JWT\JWT;
use Firebase\JWT\Key; // Needed for decoding in version 6.0+

header('Content-Type: application/json'); // Set response to JSON format

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the input from the request body (JSON)
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if username and password are provided
    $username = isset($data['username']) ? $data['username'] : '';
    $password = isset($data['password']) ? $data['password'] : '';

    if (empty($username) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Username and password are required."]);
        exit;
    }

    // Prepare and execute SQL query to get user details by username
    $stmt = $conn->prepare("SELECT * FROM customer WHERE username = :username");
    $stmt->bindValue(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify if user exists and password matches
    if ($user) {
        if (password_verify($password, $user['password'])) {
            // Generate JWT token
            $key = "your_secret_key";  // Set your secret key
            $payload = array(
                "username" => $user['username'],
                "exp" => time() + (60 * 60) // Token expiration time (1 hour)
            );

            $jwt = JWT::encode($payload, $key, 'HS256'); // Specify HS256 algorithm

            // Return success response with token
            echo json_encode(["status" => "success", "token" => $jwt]);
        } else {
            // Incorrect password
            echo json_encode(["status" => "error", "message" => "Incorrect username or password."]);
        }
    } else {
        // User does not exist
        echo json_encode(["status" => "error", "message" => "Incorrect username or password."]);
    }
} else {
    // If not POST method, return method not allowed error
    echo json_encode(["status" => "error", "message" => "Method not allowed."]);
}
?>
