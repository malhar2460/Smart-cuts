<?php
// Backend/book_appointment.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require 'db_conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// 1) Decode JSON body
$input = json_decode(file_get_contents("php://input"), true);
if (json_last_error() !== JSON_ERROR_NONE) {
  echo json_encode(["status"=>false, "message"=>"Invalid JSON"]);
  exit;
}

// 2) Extract & validate
$salon_id    = intval($input['salon_id']    ?? 0);
$service_id  = intval($input['service_id']  ?? 0);
$staff_id    = intval($input['staff_id']    ?? 0);
$customer_id = intval($input['customer_id'] ?? 0);
$date        = $input['date']               ?? '';
$time        = $input['time']               ?? '';
$payment     = $input['payment']            ?? [];

if (!($salon_id && $service_id && $staff_id && $customer_id && $date && $time && is_array($payment))) {
  echo json_encode(["status"=>false, "message"=>"Missing or invalid parameters"]);
  exit;
}

// 3) Compute full datetime and lookup price
$dt = $date . ' ' . $time . ':00';
$stmt = $conn->prepare("SELECT price FROM services WHERE service_id = ?");
$stmt->execute([$service_id]);
$price = $stmt->fetchColumn();
if (!$price) {
  echo json_encode(["status"=>false, "message"=>"Invalid service"]);
  exit;
}

try {
  $conn->beginTransaction();

  // 4) Insert appointment
  $stmt = $conn->prepare("
    INSERT INTO appointment 
      (customer_id, salon_id, staff_id, service_id, appointment_date, status,payment_status)
    VALUES
      (?, ?, ?, ?, ?, 'booked','paid')
  ");
  $stmt->execute([$customer_id, $salon_id, $staff_id, $service_id, $dt]);
  $appointment_id = $conn->lastInsertId();

  // 5) Insert payment record
  $stmt = $conn->prepare("
    INSERT INTO payment
      (appointment_id, amount, payment_method, payment_date)
    VALUES
      (?, ?, 'card', NOW())
  ");
  $details = json_encode($payment);
  $stmt->execute([$appointment_id, $price]);

  $conn->commit();
  echo json_encode(["status"=>true, "message"=>"Booked successfully", "appointment_id"=>$appointment_id]);
} catch (PDOException $e) {
  $conn->rollBack();
  http_response_code(500);
  echo json_encode(["status"=>false, "message"=>"Database error: ".$e->getMessage()]);
}
