<?php
<<<<<<< HEAD
require 'db_conn.php';  
=======
require 'db_conn.php'; 
>>>>>>> af409a3b302557791c904d1f40649640de192630
require 'vendor/autoload.php';  

use Firebase\JWT\JWT;
use Firebase\JWT\Key; 

<<<<<<< HEAD
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $data = json_decode(file_get_contents('php://input'), true);

=======
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    $data = json_decode(file_get_contents('php://input'), true);
>>>>>>> af409a3b302557791c904d1f40649640de192630
    $username = isset($data['username']) ? $data['username'] : '';
    $password = isset($data['password']) ? $data['password'] : '';

    if (empty($username)||empty($password)) 
    {
        echo json_encode(["status" => "error", "message" => "Username and password are required."]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM customer WHERE username = :username");
    $stmt->bindValue(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

<<<<<<< HEAD
    if ($user) {
        if (password_verify($password, $user['password'])) {
            
            $key = "your_secret_key";  
=======
    if ($user) 
    {
        if (password_verify($password, $user['password'])) 
        {
            $key = "your_secret_key"; 
>>>>>>> af409a3b302557791c904d1f40649640de192630
            $payload = array(
                "username" => $user['username'],
                "exp" => time() + (60 * 60) 
            );
<<<<<<< HEAD
            $jwt = JWT::encode($payload, $key, 'HS256'); 

            echo json_encode(["status" => "success", "token" => $jwt]);
        } else {
           
            echo json_encode(["status" => "error", "message" => "Incorrect username or password."]);
        }
    } else {
        
        echo json_encode(["status" => "error", "message" => "Incorrect username or password."]);
    }
} else {
    
=======
            $jwt = JWT::encode($payload, $key, 'HS256');   
            echo json_encode(["status" => "success", "token" => $jwt]);
        } 
        else 
        { 
            echo json_encode(["status" => "error", "message" => "Incorrect username or password."]);
        }
    } 
    else 
    {
        echo json_encode(["status" => "error", "message" => "Incorrect username or password."]);
    }
} 
else 
{
>>>>>>> af409a3b302557791c904d1f40649640de192630
    echo json_encode(["status" => "error", "message" => "Method not allowed."]);
}
?>
