<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);

    // Attempting to query database table
    // and retrieve auction information for the specified item from the database.
    try {
        $stmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.condition, i.quantity, i.categoryName, i.sellerID, 
                                a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, 
                                CASE WHEN MAX(b.price) > 0 THEN MAX(b.price) END AS highestBid
                                FROM auction as a 
                                LEFT JOIN item as i
                                ON a.itemID = i.itemID
                                LEFT JOIN bid AS b 
                                ON a.auctionID = b.auctionID 
                                WHERE a.auctionID = :auctionID');
        
        // Binding the provided item ID to our prepared statement.
        $stmnt->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);

        $stmnt->execute();
        
        // Fetching the row.
        while($row = $stmnt->fetch(PDO::FETCH_OBJ)) {
           // Assigning each row of data to an associative array.
           $data[] = $row;
        }

        // Returning data as JSON.
        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
