<?php

session_start(); 

require 'db_conn.php'; 
require 'vendor/autoload.php';  

use Firebase\JWT\JWT;
use Firebase\JWT\Key; 

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
   
    $data = json_decode(file_get_contents('php://input'), true);

    $username = isset($data['username']) ? $data['username'] : '';
    $password = isset($data['password']) ? $data['password'] : '';

    if (empty($username) || empty($password)) 
    {
        echo json_encode(["status" => "error", "message" => "Username and password are required."]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM admin WHERE username = :username");
    $stmt->bindValue(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) 
    {
        if (password_verify($password, $user['password'])) 
        {
            $key = "your_secret_key"; 
            $payload = array(
                "username" => $user['username'],
                "exp" => time() + (60 * 60) 
            );

            $jwt = JWT::encode($payload, $key, 'HS256'); 
            $_SESSION['admin_id'] = $user['admin_id'];
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
    echo json_encode(["status" => "error", "message" => "Method not allowed."]);
}
?>
