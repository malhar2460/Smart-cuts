<?php
include 'db_conn.php'; 

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$sql = "SELECT * from salon";

try 
{
    $stmt=$conn->prepare($sql);
    
    $stmt->execute();
    
    $services=$stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($stmt->rowCount()>0)
    {
        echo json_encode(['success'=>true,'services'=>$services]);
    } 
    else 
    {
        echo json_encode(['success'=>false,'message'=>'No salon yet..']);
    }
} 
catch (PDOException $e) 
{
    echo json_encode(['success'=>false,'message'=>'Error: '.$e->getMessage()]);
}

$conn=null; 
?>
