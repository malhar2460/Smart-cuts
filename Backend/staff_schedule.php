<?php
// staff_schedule.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require 'db_conn.php';

$staff_id = isset($_GET['staff_id']) ? intval($_GET['staff_id']) : 0;
$date = isset($_GET['date']) ? $_GET['date'] : '';

if ($staff_id <= 0 || !$date) {
    echo json_encode([
        "status"  => false,
        "message" => "staff_id and date are required"
    ]);
    exit;
}

try {
    // 1) Fetch all appointments for the specified date and staff
    $stmt = $conn->prepare("
        SELECT 
          a.appointment_id,
          a.appointment_date AS date_time,
          s.service_name AS service,
          c.username AS client
        FROM appointment a
        JOIN services s   ON a.service_id  = s.service_id
        JOIN customer c   ON a.customer_id = c.customer_id
        WHERE a.staff_id = :sid
          AND DATE(a.appointment_date) = :date
        ORDER BY a.appointment_date
    ");
    $stmt->execute([
        ':sid' => $staff_id,
        ':date' => $date
    ]);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2) Group appointments by time (HH:MM)
    $timeGroups = [];

    foreach ($rows as $r) {
        $time = date("H:i", strtotime($r['date_time']));
        if (!isset($timeGroups[$time])) {
            $timeGroups[$time] = [];
        }

        $timeGroups[$time][] = [
            'appointment_id' => (int)$r['appointment_id'],
            'staff_id'       => $staff_id,
            'staff_name'     => '', // optional, can be populated if needed
            'service'        => $r['service'],
            'client'         => $r['client'],
            'date_time'      => $r['date_time'],
        ];
    }

    // 3) Build response array
    $appointments = [];

    foreach ($timeGroups as $time => $apps) {
        $appointments[] = [
            'time' => $time,
            'appointments' => [ $apps ]  // Wrap in an outer array (columns array)
        ];
    }

    echo json_encode([
        "status" => true,
        "appointments" => $appointments
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status"  => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
