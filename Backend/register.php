<?php
include 'db_conn.php';

<<<<<<< HEAD
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $input = json_decode(file_get_contents("php://input"), true);

    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    $email = $input['email'] ?? '';
    $phone_number = $input['phone_number'] ?? '';
    $created_at = date('Y-m-d H:i:s');  

    if (!empty($username) && !empty($password) && !empty($email) && !empty($phone_number)) {
        try {
            
            $stmt = $conn->prepare("SELECT * FROM customer WHERE email = ?");
            $stmt->execute([$email]);
            $existingUser = $stmt->fetch();

            if ($existingUser) {
                echo json_encode(['status' => 'error', 'message' => 'User with this email already exists.']);
            } else {
                
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

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
=======
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(empty($data['username']) || empty($data['email']) || empty($data['password']) || empty($data['phone_number'])) 
{
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required.'
    ]);
    exit();
>>>>>>> af409a3b302557791c904d1f40649640de192630
}

$username = $data['username'];
$email = $data['email'];
$password = $data['password'];
$phone_number = $data['phone_number'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) 
{
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid email format.'
    ]);
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

try 
{
    $checkUserQuery = $conn->prepare("SELECT * FROM customer WHERE email = :email OR username = :username");
    $checkUserQuery->bindParam(':email', $email);
    $checkUserQuery->bindParam(':username', $username);
    $checkUserQuery->execute();

    if ($checkUserQuery->rowCount() > 0) 
    {
        echo json_encode([
            'status' => 'error',
            'message' => 'User with this username or email already exists.'
        ]);
    } 
    else 
    {
        $insertQuery = $conn->prepare("INSERT INTO customer (username, email, password, phone_number) VALUES (:username, :email, :password, :phone_number)");
        $insertQuery->bindParam(':username', $username);
        $insertQuery->bindParam(':email', $email);
        $insertQuery->bindParam(':password', $hashedPassword);
        $insertQuery->bindParam(':phone_number', $phone_number);

        if ($insertQuery->execute()) 
        {
            echo json_encode([
                'status' => 'success',
                'message' => 'User registered successfully.'
            ]);
        } 
        else 
        {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to register user.'
            ]);
        }
    }
} 
catch (PDOException $e) 
{
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
$conn = null;

?>
