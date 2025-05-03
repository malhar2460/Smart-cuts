<?php
// staff_update_profile.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require 'db_conn.php';
session_start();

$staff_id = isset($_POST['staff_id'])
    ? intval($_POST['staff_id'])
    : (isset($_SESSION['staff_id']) ? intval($_SESSION['staff_id']) : 0);

if ($staff_id <= 0) {
    echo json_encode(["status"=>false,"message"=>"staff_id is required"]);
    exit;
}

// collect inputs
$name  = trim($_POST['username']    ?? '');
$email = trim($_POST['email']         ?? '');
$phone = trim($_POST['phone_number']  ?? '');
$spec  = trim($_POST['specialization']?? '');
$avail = trim($_POST['availability']  ?? '');

if (!$name || !$email) {
    echo json_encode(["status"=>false,"message"=>"Name and email required"]);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status"=>false,"message"=>"Invalid email"]);
    exit;
}

// build SET clauses
$fields = [];
$params = [];
$fields[] = "username    = ?"; $params[] = $name;
$fields[] = "email         = ?"; $params[] = $email;
$fields[] = "phone_number  = ?"; $params[] = $phone;
$fields[] = "specialization= ?"; $params[] = $spec;
$fields[] = "availability  = ?"; $params[] = $avail;

// handle optional image
if (!empty($_FILES['image']) && $_FILES['image']['error']===UPLOAD_ERR_OK){
    $ext      = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $filename = $staff_id . "_" . time() . "." . $ext;
    $dest     = __DIR__ . "/uploads/" . $filename;
    if (move_uploaded_file($_FILES['image']['tmp_name'], $dest)) {
        $fields[]  = "image = ?";
        $params[]  = $filename;
    }
}

// finalize
$params[] = $staff_id;
$sql = "UPDATE staff SET ".implode(", ",$fields)." WHERE staff_id = ?";
try {
    $stmt = $conn->prepare($sql);
    $ok   = $stmt->execute($params);
    echo json_encode([
      "status" => (bool)$ok,
      "message"=> $ok?"Updated":"Failed",
      // if new image was set, return it
      "image"  => $filename ?? null
    ]);
} catch (PDOException $e) {
    echo json_encode(["status"=>false,"message"=>"DB error: ".$e->getMessage()]);
}
