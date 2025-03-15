<?php

include 'db_conn.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['username']) || empty($data['email']) || empty($data['password']) || empty($data['phone_number'])) 
{
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required.'
    ]);
    exit();
}

$username = $data['username'];
$email = $data['email'];
$password = $data['password'];
$phone_number = $data['phone_number'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid email format.'
    ]);
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

try {
    $checkUserQuery = $conn->prepare("SELECT * FROM customer WHERE email = :email OR username = :username");
    $checkUserQuery->bindParam(':email', $email);
    $checkUserQuery->bindParam(':username', $username);
    $checkUserQuery->execute();

    if ($checkUserQuery->rowCount() > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'User with this username or email already exists.'
        ]);
    } else {
        $insertQuery = $conn->prepare("INSERT INTO customer (username, email, password, phone_number) VALUES (:username, :email, :password, :phone_number)");
        $insertQuery->bindParam(':username', $username);
        $insertQuery->bindParam(':email', $email);
        $insertQuery->bindParam(':password', $hashedPassword);
        $insertQuery->bindParam(':phone_number', $phone_number);

        if ($insertQuery->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'User registered successfully.'
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to register user.'
            ]);
        }
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn = null;

?>
