<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $buyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);
    $sellerID = filter_var($obj->sellerID, FILTER_SANITIZE_NUMBER_INT);

    try {
        $data = array();
        $stmnt = $pdo->prepare('SELECT username, userID, photo, role, firstName, lastName, email, city FROM user WHERE userID = :buyerID'); 
        $stmnt->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
        $stmnt->execute();
        $data[0] = $stmnt->fetch(PDO::FETCH_OBJ);

        $stmnt = $pdo->prepare('SELECT username, userID, photo, role, firstName, lastName, email, city  FROM user WHERE userID = :sellerID'); 
        $stmnt->bindParam(':sellerID', $sellerID, PDO::PARAM_INT);
        $stmnt->execute();
        $data[1] = $stmnt->fetch(PDO::FETCH_OBJ);

        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
