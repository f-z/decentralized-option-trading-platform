<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);

    // Getting current date and time (in London, UK, timezone).
    $timezone = 'Europe/London';
    $timestamp = time();
    $currentTime = new DateTime("now", new DateTimeZone($timezone));
    $currentTime->setTimestamp($timestamp);
    $endTime = $currentTime->format('Y-m-d H:i:s');

    // Attempting to query database table to change endTime
    try {
        $stmnt = $pdo->prepare('UPDATE auction SET endTime = :endTime WHERE auctionID = :auctionID');
        
        // Binding the provided item ID to our prepared statement.
        $stmnt->bindParam(':endTime', $endTime, PDO::PARAM_STR);
        $stmnt->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
        $stmnt->execute();

        json_encode($endTime);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>