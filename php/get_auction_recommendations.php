<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT); 

    try {
        // Retrieving item.
        $stmnt = $pdo->prepare('SELECT DISTINCT auction.*, item.*, COUNT(`user`.userID) AS userCount, b.highestBid
        FROM auction
        LEFT JOIN (SELECT b2.auctionID, b2.buyerID, CASE WHEN MAX(b2.price) > 0 THEN MAX(b2.price) END AS highestBid 
                    FROM bid as b2
                    GROUP BY b2.auctionID ) AS b ON auction.auctionID = b.auctionID
        JOIN item ON auction.itemID = item.itemID
        JOIN viewing ON auction.auctionID = viewing.auctionID
        JOIN `user` ON viewing.userID = `user`.userID
        JOIN viewing AS viewing1 ON `user`.userID = viewing1.userID
        JOIN auction AS auction1 ON viewing1.auctionID = auction1.auctionID
        WHERE auction1.auctionID = :auctionID AND auction.auctionID != auction1.auctionID 
        AND auction.endTime > NOW()
        GROUP BY auction.auctionID
        ORDER BY userCount DESC
        LIMIT 3
'       );

        // Binding the provided username to our prepared statement.
        $stmnt->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);

        $stmnt->execute();

        $data=array();
            // Fetching the row.
        while($row =  $stmnt->fetch(PDO::FETCH_OBJ)){
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
