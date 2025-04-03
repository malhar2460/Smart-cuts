<?php

include 'db_conn.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['name']) || empty($data['email']) || empty($data['subject']) || empty($data['message'])) 
{
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required.'
    ]);
    exit();
}

$name = $data['name'];
$email = $data['email'];
$subject = $data['subject'];
$message = $data['message'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid email format.'
    ]);
    exit();
}

try
{
    $sql="INSERT INTO customer_queries(name, email, subject, message) VALUES (:name, :email, :subject, :message)";

    if ($stmt=$conn->prepare($sql)) 
    {
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);

        if($stmt->execute()) 
        {
            echo json_encode(["status" => "success", "message" => "Customer query received."]);
        } 
        else
        {
            echo json_encode(["status" => "error", "message" => "Failed to submit contact us form."]);
        }
    }
    else 
    {
        echo json_encode(["status" => "error", "message" => "SQL query preparation failed."]);
    }
}   
catch (PDOException $e) 
{
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: '.$e->getMessage()
    ]);
}
   
$conn = null;

?>
