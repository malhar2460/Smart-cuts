<?php
// Backend/available_slots.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_conn.php';
$salon_id   = intval($_GET['salon_id'] ?? 0);
$service_id = intval($_GET['service_id'] ?? 0);
$date       = $_GET['date'] ?? "";

if (!$salon_id || !$service_id || !$date) {
    echo json_encode(["status"=>false, "message"=>"Missing parameters"]);
    exit;
}

$stmt = $conn->prepare("SELECT duration FROM services WHERE service_id = ?");
$stmt->execute([$service_id]);
$duration = $stmt->fetchColumn();
if (!$duration) {
    echo json_encode(["status" => false, "message" => "Invalid service_id"]);
    exit;
}


// 2️⃣ Build time slots between 09:00 and 17:00
$times = [];
$start = new DateTime("$date 09:00");
$end   = new DateTime("$date 17:00");
$interval = new DateInterval("PT{$duration}M");
for ($t = clone $start; $t < $end; $t->add($interval)) {
    $times[] = $t->format("H:i");
}

// 3️⃣ Get all staff for this salon
$stmt = $conn->prepare("
    SELECT staff_id, username AS staff_name
    FROM staff
    WHERE salon_id = ?
    ORDER BY username
");
$stmt->execute([$salon_id]); // ✅ Correct for PDO
$staff = $stmt->fetchAll(PDO::FETCH_ASSOC);


// 4️⃣ Return
echo json_encode([
    "status" => true,
    "times"  => $times,
    "staff"  => $staff
]);
