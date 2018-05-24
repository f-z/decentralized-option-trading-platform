<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $userID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT);
    $includeExpired = filter_var($obj->includeExpired, FILTER_VALIDATE_BOOLEAN); 

    try {

        // Declaring an empty array to store the data we retrieve from the database in.
        $data = array();

        // Retrieving auctions:

        $data['auctions']=array();

         if($includeExpired == TRUE) {
            $auctionStmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.`condition`, i.quantity, i.categoryName, i.sellerID, 
                a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, 
                CASE WHEN MAX(b.price) > 0 THEN MAX(b.price) END AS highestBid
                FROM item AS i, auction as a 
                LEFT JOIN bid AS b 
                ON a.auctionID = b.auctionID 
                AND b.price = (SELECT MAX(price) FROM bid 
                    WHERE auctionID = a.auctionID
                )
                WHERE i.itemID = a.itemID AND (sellerID = :sellerID) 
                AND a.endTime = (SELECT MAX(a2.endTime) FROM auction AS a2 
                                                WHERE a2.itemID = a.itemID)
                GROUP BY a.auctionID');
        } else {
            $auctionStmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.`condition`, i.quantity, i.categoryName, i.sellerID, 
                a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, 
                CASE WHEN MAX(b.price) > 0 THEN MAX(b.price) END AS highestBid
                FROM item AS i, auction as a 
                LEFT JOIN bid AS b 
                ON a.auctionID = b.auctionID 
                AND b.price = (SELECT MAX(price) FROM bid 
                    WHERE auctionID = a.auctionID
                )
                WHERE i.itemID = a.itemID AND (sellerID = :sellerID) AND a.endTime > NOW()
                GROUP BY a.auctionID');
        }

        // Binding the provided username to our prepared statement.
        $auctionStmnt->bindParam(':sellerID', $userID, PDO::PARAM_INT);

        $auctionStmnt->execute();
            // Fetching the row.
        while($row = $auctionStmnt->fetch(PDO::FETCH_OBJ)) {
                // Assigning each row of data to an associative array.
        $data['auctions'][] = $row;
        }
     
        //retieving user bids
        $data['topbids']=array();

         $bidsStmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.`condition`, i.quantity, i.categoryName, i.sellerID, 
            a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, b.price AS highestBid 
            FROM item AS i, auction as a 
            LEFT JOIN bid AS b 
            ON a.auctionID = b.auctionID 
            AND b.price != 0
            AND b.price = (SELECT MAX(price) FROM bid 
                WHERE auctionID = a.auctionID
            )
            WHERE i.itemID = a.itemID AND buyerID = :buyerID 
            GROUP BY a.auctionID');

        // Binding the provided username to our prepared statement.
        $bidsStmnt->bindParam(':buyerID', $userID, PDO::PARAM_INT);
        $bidsStmnt->execute();

     // Fetching the row.
        while($row = $bidsStmnt->fetch(PDO::FETCH_OBJ)) {
            // Assigning each row of data to an associative array.
            $data['topbids'][] = $row;
        }

        // Retrieving watching user.
        $data['watching']=array();

         $watchingStmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.`condition`, i.quantity, i.categoryName, i.sellerID, 
                a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime,
                CASE WHEN MAX(b.price) > 0 THEN MAX(b.price) END AS highestBid
            FROM item AS i, auction as a 
            LEFT JOIN bid AS b 
            ON b.auctionID = a.auctionID 
            WHERE i.itemID = a.itemID AND a.endTime > adddate(NOW(),-7) 
            GROUP BY a.auctionID
            HAVING 0 = (SELECT MAX(b1.price) as maxbid FROM bid AS b1 
                    WHERE b1.auctionID = a.auctionID 
                    AND b1.buyerID = :buyerID)
            AND 1 = (SELECT COUNT(b2.buyerID) as bidcount FROM bid AS b2
                        WHERE b2.auctionID = a.auctionID 
                        AND b2.buyerID = :buyerID2
                    )'
                );

        // Binding the provided username to our prepared statement.
        $watchingStmnt->bindParam(':buyerID', $userID, PDO::PARAM_INT);
        $watchingStmnt->bindParam(':buyerID2', $userID, PDO::PARAM_INT);
        $watchingStmnt->execute();

     // Fetching the row.
        while($row = $watchingStmnt->fetch(PDO::FETCH_OBJ)) {
            // Assigning each row of data to an associative array.
            $data['watching'][] = $row;
        }

        // Retrieving outbid user.
        $data['outbid'] = array();

        $outbidStmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.`condition`, i.quantity, i.categoryName, i.sellerID, 
                a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime,  
                CASE WHEN MAX(b.price) > 0 THEN MAX(b.price) END AS highestBid
                FROM item AS i, auction as a 
                LEFT JOIN bid AS b 
                ON a.auctionID = b.auctionID 
                WHERE i.itemID = a.itemID AND a.endTime > adddate(NOW(),-7)
                GROUP BY a.auctionID
                HAVING :buyerID != (SELECT b2.buyerID FROM bid AS b2
                                    WHERE b2.auctionID = a.auctionID
                                    AND b2.price = (SELECT MAX(b3.price) FROM bid as b3
                                                WHERE b3.auctionID = b2.auctionID) 
                                )
                AND  0 < (SELECT MAX(b1.price) AS maxbid
                        FROM bid as b1 
                        WHERE b1.auctionID = a.auctionID 
                        AND b1.buyerID = :buyerID2
                        )'
                    );

        // Binding the provided username to our prepared statement.
        $outbidStmnt->bindParam(':buyerID', $userID, PDO::PARAM_INT);
        $outbidStmnt->bindParam(':buyerID2', $userID, PDO::PARAM_INT);

        $outbidStmnt->execute();

        // Fetching the row.
        while($row = $outbidStmnt->fetch(PDO::FETCH_OBJ)) {
            // Assigning each row of data to an associative array.
            $data['outbid'][] = $row;
        }

        // Returning data as JSON.
        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
