<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,OPTIONS");

require_once __DIR__ . '/db_conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

date_default_timezone_set('Asia/Kolkata');

$salon_id = intval($_GET['salon_id'] ?? 0);
$viewMode = $_GET['viewMode'] ?? 'day';
$date = $_GET['date'] ?? '';

if (!$salon_id) {
    echo json_encode(["status" => false, "message" => "Missing salon_id"]);
    exit;
}
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    echo json_encode(["status" => false, "message" => "Invalid date format"]);
    exit;
}

// Fetch stylists with string IDs
$stmt = $conn->prepare("
    SELECT staff_id, staff_name 
    FROM staff 
    WHERE salon_id = :sid
    ORDER BY staff_id
");
$stmt->execute([':sid' => $salon_id]);
$stylists = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($stylists)) {
    echo json_encode(["status" => false, "message" => "No stylists found"]);
    exit;
}

$stylistIdList = array_column($stylists, 'staff_id');
$stylistIdMap = array_flip($stylistIdList); // [staff_id => index]

// Set date range
$start = $end = $date;

// Get appointments
$sql = "
    SELECT
        a.appointment_id,
        a.staff_id,
        s.staff_name,
        sv.service_name AS service,
        c.username AS client,
        DATE_FORMAT(a.appointment_date, '%Y-%m-%dT%H:%i:%s') AS date_time,
        a.status
    FROM appointment a
    JOIN staff s ON a.staff_id = s.staff_id
    JOIN services sv ON a.service_id = sv.service_id
    JOIN customer c ON a.customer_id = c.customer_id
    WHERE s.salon_id = :sid
    AND DATE(a.appointment_date) = :date
    ORDER BY a.appointment_date
";
$stmt = $conn->prepare($sql);
$stmt->execute([':sid' => $salon_id, ':date' => $date]);
$apps = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Generate time slots from 08:00 to 22:00
$slots = [];
for ($h = 8; $h <= 22; $h++) {
    $time = sprintf("%02d:00", $h);
    $slots[$time] = array_fill(0, count($stylists), []);
}

// Assign appointments to slots
foreach ($apps as $a) {
    $t = date('H:00', strtotime($a['date_time']));
    $staffIndex = $stylistIdMap[$a['staff_id']] ?? null;
    
    if ($staffIndex !== null && isset($slots[$t])) {
        $slots[$t][$staffIndex][] = $a;
    }
}

// Build structured output
$structured = [];
foreach ($slots as $time => $appointments) {
    $structured[] = [
        "time" => $time,
        "appointments" => $appointments
    ];
}

// Stats
$total = count($apps);
$pending = count(array_filter($apps, fn($a) => $a['status'] === 'pending'));
$stats = [
    ["title" => "Total Appointments", "value" => (string)$total],
    ["title" => "Pending Confirmation", "value" => (string)$pending],
    ["title" => "Available Slots", "value" => (string)max(0, 100 - $total)],
    ["title" => "Revenue Today", "value" => "$" . ($total * 50)] // Example revenue calculation
];

echo json_encode([
    "status" => true,
    "stylists" => array_column($stylists, 'staff_name'),
    "appointments" => $structured,
    "stats" => $stats
], JSON_PRETTY_PRINT);
?>