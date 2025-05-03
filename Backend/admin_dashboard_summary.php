<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");

include 'db_conn.php';

// Get and validate admin_id
$admin_id = isset($_GET['admin_id']) ? intval($_GET['admin_id']) : 0;
if ($admin_id === 0) {
    echo json_encode(["status" => false, "message" => "Admin ID is required"]);
    exit;
}

$today     = date('Y-m-d');
$yesterday = date('Y-m-d', strtotime('-1 day'));

try {
    // 1) Appointments: today & yesterday
    $sqlAppt = "
      SELECT 
        SUM(CASE WHEN DATE(appointment_date)=? THEN 1 ELSE 0 END) AS todays,
        SUM(CASE WHEN DATE(appointment_date)=? THEN 1 ELSE 0 END) AS yesterdays
      FROM appointment
      WHERE admin_id = ?
    ";
    $stmt = $conn->prepare($sqlAppt);
    $stmt->execute([$today, $yesterday, $admin_id]);
    $apptCounts = $stmt->fetch(PDO::FETCH_ASSOC);
    $todays_appointments      = (int)$apptCounts['todays'];
    $yesterdays_appointments  = (int)$apptCounts['yesterdays'];

    // 2) Revenue: today & yesterday
    $sqlRev = "
      SELECT
        SUM(CASE WHEN DATE(p.payment_date)=? THEN p.amount ELSE 0 END) AS today_rev,
        SUM(CASE WHEN DATE(p.payment_date)=? THEN p.amount ELSE 0 END) AS yest_rev
      FROM payment p
      JOIN appointment a ON p.appointment_id = a.appointment_id
      WHERE a.admin_id = ?
    ";
    $stmt = $conn->prepare($sqlRev);
    $stmt->execute([$today, $yesterday, $admin_id]);
    $rev = $stmt->fetch(PDO::FETCH_ASSOC);
    $revenue_today      = (float)$rev['today_rev'];
    $revenue_yesterday  = (float)$rev['yest_rev'];

    // 3) New customers: those who booked with this admin, created today & yesterday
    $sqlCust = "
      SELECT
        COUNT(DISTINCT CASE WHEN DATE(c.created_at)=? THEN c.customer_id END) AS new_today,
        COUNT(DISTINCT CASE WHEN DATE(c.created_at)=? THEN c.customer_id END) AS new_yest
      FROM customer c
      JOIN appointment a ON c.customer_id = a.customer_id
      WHERE a.admin_id = ?
    ";
    $stmt = $conn->prepare($sqlCust);
    $stmt->execute([$today, $yesterday, $admin_id]);
    $cust = $stmt->fetch(PDO::FETCH_ASSOC);
    $new_customers              = (int)$cust['new_today'];
    $new_customers_yesterday    = (int)$cust['new_yest'];

    // 4) Reviews: overall & yesterday, only for this admin's services
    $sqlRevw = "
      SELECT
        AVG(CASE WHEN DATE(r.created_at) IS NOT NULL THEN r.rating END) AS avg_all,
        AVG(CASE WHEN DATE(r.created_at)=? THEN r.rating END) AS avg_yest,
        COUNT(CASE WHEN DATE(r.created_at) IS NOT NULL THEN 1 END) AS total_reviews
      FROM review r
      JOIN services s ON r.service_id = s.service_id
      JOIN salon   l ON s.salon_id   = l.salon_id
      WHERE l.admin_id = ?
    ";
    $stmt = $conn->prepare($sqlRevw);
    $stmt->execute([$yesterday, $admin_id]);
    $revw = $stmt->fetch(PDO::FETCH_ASSOC);

    $average_rating           = $revw['avg_all'] !== null
                                 ? round((float)$revw['avg_all'], 1)
                                 : 0.0;
    $average_rating_previous  = $revw['avg_yest'] !== null
                                 ? round((float)$revw['avg_yest'], 1)
                                 : 0.0;
    $total_reviews            = (int)$revw['total_reviews'];

    // Return everything
    echo json_encode([
        "status" => true,
        "data" => [
            "todays_appointments"           => $todays_appointments,
            "yesterdays_appointments"       => $yesterdays_appointments,
            "revenue_today"                 => $revenue_today,
            "revenue_yesterday"             => $revenue_yesterday,
            "new_customers"                 => $new_customers,
            "new_customers_yesterday"       => $new_customers_yesterday,
            "average_rating"                => $average_rating,
            "average_rating_previous"       => $average_rating_previous,
            "total_reviews"                 => $total_reviews,
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
