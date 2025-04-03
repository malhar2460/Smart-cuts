<?php
include 'db_conn.php'; 

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");

if (!isset($_GET['salon_id']) || empty($_GET['salon_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing salon_id']);
    exit;
}

$salon_id = intval($_GET['salon_id']);
$sql = "SELECT sal.*,se.* from salon sal,services se where sal.salon_id=se.salon_id and se.salon_id=:salon_id";

try 
{
    $stmt=$conn->prepare($sql);
    $stmt->bindParam(':salon_id',$salon_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $services=$stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($stmt->rowCount()>0)
    {
        echo json_encode(['success'=>true,'services'=>$services]);
    } 
    else 
    {
        echo json_encode(['success'=>false,'message'=>'No services found']);
    }
} 
catch (PDOException $e) 
{
    echo json_encode(['success'=>false,'message'=>'Error: '.$e->getMessage()]);
}

$conn=null; 
?>
