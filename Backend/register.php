<?php
include 'db_conn.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status'=>'error','message'=>'Invalid request method.']);
    exit();
}

// pull common fields
$username    = $_POST['username']    ?? '';
$email       = $_POST['email']       ?? '';
$password    = $_POST['password']    ?? '';
$phone_number= $_POST['phone_number']?? '';
$role        = $_POST['role']        ?? 'customer';

if (empty($username)||empty($email)||empty($password)||empty($phone_number)) {
    echo json_encode(['status'=>'error','message'=>'All fields are required.']);
    exit();
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status'=>'error','message'=>'Invalid email format.']);
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

try {
    if ($role === 'customer') {
        // ——— customer path (exactly your existing code, but using $_FILES['photo'] if you’ve aligned names) ———
        $check = $conn->prepare("SELECT 1 FROM customer WHERE email=:email OR username=:username");
        $check->execute([':email'=>$email,':username'=>$username]);
        if ($check->fetch()) {
            echo json_encode(['status'=>'error','message'=>'Customer already exists.']);
            exit();
        }

        if (empty($_FILES['photo']['name'])) {
            echo json_encode(['status'=>'error','message'=>'Photo file not received.']);
            exit();
        }
        $dir = 'uploads/customers/';
        if (!is_dir($dir)) mkdir($dir, 0777, true);

        $customerPhoto = basename($_FILES['photo']['name']);
        $photoPath     = $dir . $customerPhoto;
        move_uploaded_file($_FILES['photo']['tmp_name'], $photoPath);

        $stmt = $conn->prepare(
          "INSERT INTO customer 
             (username,email,password,phone_number,photo)
           VALUES
             (:u,:e,:p,:ph,:img)"
        );
        $stmt->execute([
          ':u'=>$username,
          ':e'=>$email,
          ':p'=>$hashedPassword,
          ':ph'=>$phone_number,
          ':img'=>$photoPath
        ]);

        echo json_encode(['status'=>'success','message'=>'Customer registered successfully.']);
        exit();
    }
    elseif ($role === 'admin') {
        // 1) check duplicates
        $check = $conn->prepare("SELECT 1 FROM admin WHERE email=:e OR username=:u");
        $check->execute([':e'=>$email,':u'=>$username]);
        if ($check->fetch()) {
            echo json_encode(['status'=>'error','message'=>'Admin already exists.']);
            exit();
        }
    
        // 2) profile photo
        if (empty($_FILES['photo']['name'])) {
            echo json_encode(['status'=>'error','message'=>'Profile photo not received.']);
            exit();
        }
        // 3) salon image
        if (empty($_FILES['salonImage']['name'])) {
            echo json_encode(['status'=>'error','message'=>'Salon image not received.']);
            exit();
        }
    
        // 4) move uploads
        $dirProf  = 'uploads/';
        $dirSalon = 'uploads/';
        if (!is_dir($dirProf))  mkdir($dirProf,  0777, true);
        if (!is_dir($dirSalon)) mkdir($dirSalon, 0777, true);
    
        $profName = basename($_FILES['photo']['name']);
        $profPath = $dirProf . $profName;
        move_uploaded_file($_FILES['photo']['tmp_name'], $profPath);
    
        $salonImgName = basename($_FILES['salonImage']['name']);
        $salonPath    = $dirSalon . $salonImgName;
        move_uploaded_file($_FILES['salonImage']['tmp_name'], $salonPath);
    
        // 5) insert into admin
        $stmt = $conn->prepare(
          "INSERT INTO admin
             (username,email,password,phone_number,photo)
           VALUES
             (:u,:e,:p,:ph,:img)"
        );
        $stmt->execute([
          ':u'=>$username,
          ':e'=>$email,
          ':p'=>$hashedPassword,
          ':ph'=>$phone_number,
          ':img'=>$profPath,
        ]);
        $adminId = $conn->lastInsertId();
    
        // 6) insert into salon
        $salon = $conn->prepare(
          "INSERT INTO salon
             (salon_name,location,contact,admin_id,description,image)
           VALUES
             (:name,:loc,:cont,:aid,:desc,:img)"
        );
        $salon->execute([
          ':name'=>$_POST['salonName']        ?? '',
          ':loc' =>$_POST['salonAddress']     ?? '',
          ':cont'=>$_POST['salonContact']     ?? '',
          ':aid' =>$adminId,
          ':desc'=>$_POST['salonDescription'] ?? '',
          ':img' =>$salonPath,
        ]);
    
        echo json_encode(['status'=>'success','message'=>'Admin & salon registered.']);
        exit();
    }
    
    else {
        echo json_encode(['status'=>'error','message'=>'Unknown role.']);
        exit();
    }
}
catch (PDOException $e) {
    echo json_encode(['status'=>'error','message'=>'DB Error: '.$e->getMessage()]);
    exit();
}
