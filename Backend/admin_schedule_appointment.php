<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_conn.php';

// Get selected date and view mode
$date = $_GET['date'] ?? date("Y-m-d");
$viewMode = $_GET['viewMode'] ?? "day";

try {
    // 1. Fetch stylists
    $stylistStmt = $conn->prepare("SELECT staff_id, staff_name FROM staff");
    $stylistStmt->execute();
    $stylists = $stylistStmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Prepare time range depending on view mode
    $startDate = $date;
    $endDate = $date;

    if ($viewMode === "week") {
        $startDate = date("Y-m-d", strtotime($date . " - " . date("w", strtotime($date)) . " days")); // Start of week
        $endDate = date("Y-m-d", strtotime($startDate . " +6 days")); // End of week
    } elseif ($viewMode === "month") {
        $startDate = date("Y-m-01", strtotime($date));
        $endDate = date("Y-m-t", strtotime($date));
    }

    // 3. Fetch appointments between date range (using SELECT * to log raw data)
    $appointmentStmt = $conn->prepare("
        SELECT a.appointment_id,
            a.appointment_date,
            a.status,
            a.payment_status,
            c.username AS client,
            s.service_name AS service,
            st.staff_id,
            st.staff_name FROM appointment a
        INNER JOIN customer c ON a.customer_id = c.customer_id
        INNER JOIN services s ON a.service_id = s.service_id
        INNER JOIN staff st ON a.staff_id = st.staff_id
        WHERE DATE(a.appointment_date) BETWEEN ? AND ?
        ORDER BY a.appointment_date ASC
    ");
    $appointmentStmt->execute([$startDate, $endDate]);
    $appointmentsRaw = $appointmentStmt->fetchAll(PDO::FETCH_ASSOC);

    // Log raw data to check the format
    error_log("Raw appointments data:");
    foreach ($appointmentsRaw as $app) {
        error_log(print_r($app, true));  // This will log the raw data of each appointment
    }

    // 4. Time slot generator (e.g., 09:00 to 18:00)
    $timeSlots = [];
    $startTime = strtotime("09:00");
    $endTime = strtotime("18:00");
    for ($t = $startTime; $t <= $endTime; $t += 3600) {
        $timeSlots[] = date("H:i", $t);
    }

    // 5. Organize appointments into time slots and stylist columns
    $appointments = [];
    foreach ($timeSlots as $time) {
        $slot = [
            "time" => $time,
            "appointments" => []
        ];
        foreach ($stylists as $index => $stylist) {
            $match = null;
            foreach ($appointmentsRaw as $app) {
                // Extract appointment date and time parts
                $appointmentDate = date("Y-m-d", strtotime($app["appointment_date"]));  // Extract date part
                $appointmentTime = date("H:i", strtotime($app["appointment_date"]));   // Extract time part (H:i)

                // Debugging: Log the values to check for discrepancies
                error_log("Checking: Slot Time = $time, Appointment Time = $appointmentTime");

                // Match appointment date and time
                if (
                    $app["staff_id"] == $stylist["staff_id"] &&
                    $appointmentDate === $date &&
                    date("H", strtotime($app["appointment_date"])) === date("H", strtotime($time))
                ) {
                    // Create the appointment match
                    $match = [
                        "appointment_id" => $app["appointment_id"],
                        "stylistIndex"   => $index,
                        "service"        => $app["service"],
                        "client"         => $app["client"],
                        "color"          => "bg-blue-100"
                    ];
                    break;
                }
                
            }
            if ($match) {
                $slot["appointments"][] = $match;
            } else {
                $slot["appointments"][] = []; // Empty slot
            }
        }
        $appointments[] = $slot;
    }

    // 6. Basic stats for the header
    $totalAppointments = count($appointmentsRaw);
    $pending = count(array_filter($appointmentsRaw, fn($a) => $a['status'] === 'pending'));
    $availableSlots = (count($stylists) * count($timeSlots)) - $totalAppointments;
    $revenueToday = array_reduce($appointmentsRaw, function ($sum, $a) use ($date) {
        return (date("Y-m-d", strtotime($a['appointment_date'])) === $date && $a['payment_status'] === 'paid') ? $sum + 1 : $sum;
    }, 0); // Replace 1 with service price if needed

    $stats = [
        ["title" => "Total Appointments", "value" => "$totalAppointments"],
        ["title" => "Pending Confirmation", "value" => "$pending"],
        ["title" => "Available Slots", "value" => "$availableSlots"],
        ["title" => "Revenue Today", "value" => "\$$revenueToday"]
    ];

    // 7. Return formatted data
    echo json_encode([
        "status" => true,
        "stylists" => array_column($stylists, "staff_name"),
        "appointments" => $appointments,
        "stats" => $stats
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>
