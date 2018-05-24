<?php
    require_once('connect_azure_db.php');

    // Attempting to query database table and retrieve data.
    try {
        $stmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.condition, i.quantity, i.categoryName, i.sellerID, 
                                a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, 
                                CASE WHEN MAX(b.price) > 0 THEN MAX(b.price) END AS highestBid
                                FROM item AS i, auction as a 
                                LEFT JOIN bid AS b 
                                ON a.auctionID = b.auctionID 
                                AND b.price = (SELECT MAX(price) FROM bid 
                                WHERE auctionID = a.auctionID
                                )
                                WHERE i.itemID = a.itemID
                                AND a.endTime > NOW()
                                GROUP BY a.auctionID');

        $stmnt->execute();
 
        // Declaring an empty array to store the data we retrieve from the database in.
        $data = array();

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
