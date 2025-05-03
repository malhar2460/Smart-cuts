<?php
// staff_profile.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require 'db_conn.php';

// get staff_id from GET or session
$staff_id = isset($_GET['staff_id'])
    ? intval($_GET['staff_id'])
    : (isset($_SESSION['staff_id']) ? intval($_SESSION['staff_id']) : 0);

if ($staff_id <= 0) {
    echo json_encode(["status"=>false,"message"=>"staff_id is required"]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT
          username,
          email,
          phone_number,
          specialization,
          availability,
          photo
        FROM staff
        WHERE staff_id = ?
        LIMIT 1
    ");
    $stmt->execute([$staff_id]);

    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode(["status"=>true,"data"=>$row]);
    } else {
        echo json_encode(["status"=>false,"message"=>"Staff not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status"=>false,"message"=>"DB error: ".$e->getMessage()]);
}
