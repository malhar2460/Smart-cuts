<?php
include 'db_conn.php'; 

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"),true);

$customer_id=$data['customer_id'];
$service_id=$data['service_id'];
$admin_id=$data['admin_id']; 
$appointment_date=$data['appointment_date']; 

$sql="INSERT INTO appointment (customer_id, admin_id, service_id, appointment_date, status, payment_status, created_at) 
        VALUES ('$customer_id', '$admin_id', '$service_id', '$appointment_date', 'pending', 'unpaid', NOW())";


try {
    $stmt = $conn->prepare($sql);
    
    $stmt->bindParam(':customer_id', $customer_id);
    $stmt->bindParam(':admin_id', $admin_id);
    $stmt->bindParam(':service_id', $service_id);
    $stmt->bindParam(':appointment_date', $appointment_date);

    if ($stmt->execute()) 
    {
        echo json_encode(['success' => true, 'message' => 'Service selected and appointment created successfully']);
    } 
    else 
    {
        $error = $stmt->errorInfo();
        echo json_encode(['success' => false, 'message' => 'Error: ' . $error[2]]);
    }
} 
catch (PDOException $e) 
{
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$conn = null;
?>
