<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $username = filter_var($obj->username, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);

    try {
        $stmnt = $pdo->prepare('SELECT username, firstName, lastName, phone, email, region, photo, registrationNumber FROM users WHERE username = :username'); 
        $stmnt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmnt->execute();
        $data = $stmnt->fetch(PDO::FETCH_OBJ);

        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
