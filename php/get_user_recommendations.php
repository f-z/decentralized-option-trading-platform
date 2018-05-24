<?php
  require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $userID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT); 

    try{
        $stmnt = $pdo->prepare(
            'SELECT v.auctionID, COUNT(v.userID), i.itemID, i.name, i.photo,
            i.description, i.`condition`, i.quantity, i.categoryName, i.sellerID,
            a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, b.highestBid
            FROM viewing AS v
                INNER JOIN auction AS a ON v.auctionID = a.auctionID
                    INNER JOIN item AS i ON a.itemID = i.itemID 
                        LEFT JOIN ( SELECT b2.auctionID, b2.buyerID,
                                    CASE WHEN MAX(b2.price) > 0 THEN MAX(b2.price) END AS highestBid 
                                    FROM bid as b2
                                    GROUP BY b2.auctionID) AS b ON v.auctionID = b.auctionID
            WHERE v.userID IN ( 
                SELECT * FROM ( SELECT other_user_views.userID AS other_userID
                                FROM viewing AS other_user_views 
                                JOIN viewing AS current_user_views 
                                ON current_user_views.auctionID =  other_user_views.auctionID 
                                AND current_user_views.userID = :userID1
                                AND current_user_views.userID != other_user_views.userID
                                GROUP BY other_user_views.userID
                                ORDER BY COUNT(*) DESC
                                LIMIT 20) AS similar_users_userIDs)
            AND v.auctionID NOT IN (SELECT auctionID
                                    FROM viewing AS v1
                                    WHERE v1.userID = :userID2)
            AND a.endTime > NOW()
            AND i.sellerID != :userID3
            GROUP BY v.auctionID
            ORDER BY COUNT(v.userID) DESC
            LIMIT 9');

        // Binding the provided username to our prepared statement.
        $stmnt->bindParam(':userID1', $userID, PDO::PARAM_INT);
        $stmnt->bindParam(':userID2', $userID, PDO::PARAM_INT);
        $stmnt->bindParam(':userID3', $userID, PDO::PARAM_INT);

        $stmnt->execute();

        $data=array();

        // Fetching the row.
        while( $row = $stmnt->fetch(PDO::FETCH_OBJ)){
                $data[] = $row;
            }
        echo json_encode($data);
}  catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
