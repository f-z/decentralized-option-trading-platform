<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $itemID = filter_var($obj->itemID, FILTER_SANITIZE_NUMBER_INT); 

    try {
        // Retrieving item.
        $stmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.condition, i.quantity, i.categoryName, i.sellerID, a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, 
             CASE WHEN MAX(b.price) > 0 THEN MAX(b.price) END AS highestBid
                FROM item AS i, auction as a 
                LEFT JOIN bid AS b 
                ON a.auctionID = b.auctionID 
                WHERE i.itemID = a.itemID
                AND i.itemID = :itemID');
       
        // Binding the provided username to our prepared statement.
        $stmnt->bindParam(':itemID', $itemID, PDO::PARAM_INT);

        $stmnt->execute();
            // Fetching the row.
        $data = $stmnt->fetch(PDO::FETCH_OBJ);
     
        // Returning data as JSON.
        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
