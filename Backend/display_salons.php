<?php
include 'db_conn.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

// 1. Pull each salon plus its avg rating and review count
$sql = "
    SELECT
        s.*,
        ROUND(IFNULL(AVG(r.rating), 0), 1) AS avg_rating,
        COUNT(r.review_id)           AS review_count
    FROM salon s
    LEFT JOIN review r
      ON r.salon_id = s.salon_id
    GROUP BY s.salon_id
";

try {
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $salons = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($salons) > 0) {
        echo json_encode([
            'success' => true,
            'services'=> $salons
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No salons found.'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn = null;
