<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_conn.php';

$appointment_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($appointment_id === 0) {
    echo json_encode(["status" => false, "message" => "Invalid appointment ID"]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT 
            a.appointment_id,
            a.service_id,
            a.appointment_date,
            s.staff_id,
            s.staff_name,
            c.username
        FROM appointment a
        INNER JOIN staff s ON a.staff_id = s.staff_id
        INNER JOIN customer c ON a.customer_id = c.customer_id
        WHERE a.appointment_id = ?
    ");
    $stmt->execute([$appointment_id]);
    $appointmentDetails = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($appointmentDetails) {
        // For demonstration, also fetch “previous appointments” from same client
        $clientName = $appointmentDetails['username'];
        $stmt2 = $conn->prepare("
            SELECT 
                a.appointment_id,
                a.appointment_date
            FROM appointment a
            INNER JOIN customer c ON a.customer_id = c.customer_id
            WHERE c.username = ?
              AND a.appointment_id != ?
            ORDER BY a.appointment_date DESC
            LIMIT 3
        ");
        $stmt2->execute([$clientName, $appointment_id]);
        $previousAppointments = $stmt2->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "data" => [
                "appointment" => $appointmentDetails,
                "previous_appointments" => $previousAppointments
            ]
        ]);
    } else {
        echo json_encode(["status" => false, "message" => "Appointment not found"]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
