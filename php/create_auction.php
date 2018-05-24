<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    try {
        // Adding new auction to database.

        $itemID = filter_var($obj->itemID, FILTER_SANITIZE_NUMBER_INT);

        // Getting current date and time (in London, UK, timezone).
        $timezone = 'Europe/London';
        $timestamp = time();
        $currentDate = new DateTime("now", new DateTimeZone($timezone));
        $currentDate->setTimestamp($timestamp);
        $startTime = $currentDate->format('Y-m-d H:i:s');

        // Sanitising URL supplied values.
        $endDate = filter_var($obj->endDate, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $endTime = filter_var($obj->endTime, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $endTime = $endDate . " " . $endTime;

        $startPrice = filter_var($obj->startPrice, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $reservePrice = filter_var($obj->reservePrice, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $buyNowPrice = filter_var($obj->buyNowPrice, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

        $auctionQuery = "INSERT INTO `auction` (`startPrice`, `reservePrice`, `buyNowPrice`, `startTime`, `endTime`, `isNotified`, `itemID`) VALUES (?, ?, ?, ?, ?, 0, ?);";

        $insertAuction = $pdo->prepare($auctionQuery);
        $insertAuction->bindParam(1, $startPrice, PDO::PARAM_STR);
        $insertAuction->bindParam(2, $reservePrice, PDO::PARAM_STR);
        $insertAuction->bindParam(3, $buyNowPrice, PDO::PARAM_STR);
        $insertAuction->bindParam(4, $startTime, PDO::PARAM_STR);
        $insertAuction->bindParam(5, $endTime, PDO::PARAM_STR);
        $insertAuction->bindParam(6, $itemID, PDO::PARAM_INT);

        $insertAuction->execute();
    }
    catch (Exception $e) {
        $error = $e->getMessage();
    }
?>
