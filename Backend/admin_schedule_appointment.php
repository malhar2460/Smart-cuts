<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,OPTIONS");

require_once __DIR__ . '/db_conn.php';
date_default_timezone_set('Asia/Kolkata');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 1) Validate inputs
$salon_id = isset($_GET['salon_id']) ? intval($_GET['salon_id']) : 0;
$date     = $_GET['date'] ?? '';

if ($salon_id <= 0) {
    echo json_encode(["status" => false, "message" => "Missing or invalid salon_id"]);
    exit;
}
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    echo json_encode(["status" => false, "message" => "Invalid date format"]);
    exit;
}

try {
    // 2) Fetch ALL stylists for this salon
    $stmt = $conn->prepare("
        SELECT staff_id, username
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

    // Build a map [staff_id => columnIndex]
    $stylistIds = array_column($stylists, 'staff_id');
    $stylistMap = array_flip($stylistIds);

    // 3) Fetch ALL appointments for this salon & date
    $sql = "
        SELECT
            a.appointment_id,
            a.staff_id,
            s.username,
            sv.service_name AS service,
            c.username      AS client,
            DATE_FORMAT(a.appointment_date, '%Y-%m-%dT%H:%i:%s') AS date_time,
            a.status
        FROM appointment a
        JOIN staff    s  ON a.staff_id        = s.staff_id
        JOIN services sv ON a.service_id      = sv.service_id
        JOIN customer c  ON a.customer_id     = c.customer_id
        WHERE a.salon_id = :sid
          AND DATE(a.appointment_date) = :date
        ORDER BY a.appointment_date
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':sid'  => $salon_id,
        ':date' => $date
    ]);
    $apps = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4) Initialize hourly slots from 08:00 to 22:00
    $slots = [];
    for ($h = 8; $h <= 22; $h++) {
        $hourKey = sprintf("%02d:00", $h);
        // one sub-array per stylist
        $slots[$hourKey] = array_fill(0, count($stylists), []);
    }

    // 5) Slot each appointment into its hour & stylist column
    foreach ($apps as $a) {
        $hour = date('H:00', strtotime($a['date_time']));
        if (isset($slots[$hour]) && isset($stylistMap[$a['staff_id']])) {
            $col = $stylistMap[$a['staff_id']];
            $slots[$hour][$col][] = $a;
        }
    }

    // 6) Build output array
    $structured = [];
    foreach ($slots as $time => $row) {
        $structured[] = [
            "time"         => $time,
            "appointments" => $row
        ];
    }

    // 7) Compute stats
    $total   = count($apps);
    $pending = count(array_filter($apps, fn($x) => $x['status'] === 'pending'));
    $stats   = [
        ["title" => "Total Appointments",   "value" => (string)$total],
        ["title" => "Pending Confirmation", "value" => (string)$pending],
        ["title" => "Available Slots",      "value" => (string)max(0, 100 - $total)],
        ["title" => "Revenue Today",        "value" => "$" . ($total * 50)]
    ];

    // 8) Return JSON
    echo json_encode([
        "status"       => true,
        "stylists"     => array_column($stylists, 'username'),
        "appointments" => $structured,
        "stats"        => $stats
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
    exit;
}
