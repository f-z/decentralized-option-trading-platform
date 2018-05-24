<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $buyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT); 
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT); 

    try {
        // Retrieving item:
        $stmnt = $pdo->prepare('SELECT MAX(b.price) AS maxbid FROM auction as a 
            LEFT JOIN bid AS b 
            ON a.auctionID = b.auctionID 
            WHERE b.buyerID = :buyerID AND a.auctionID = :auctionID 
            AND price = 0');
       
        // Binding the provided parameters to our prepared statement.
        $stmnt->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
        $stmnt->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);

        $stmnt->execute();

        $data['watching'] = array();
         while($row = $stmnt->fetch(PDO::FETCH_OBJ)){
            $data['watching'][] = $row;
         }

        $stmnt = $pdo->prepare('SELECT MAX(b.price) as outbid 
                                FROM auction as a 
                                LEFT JOIN bid AS b 
                                ON a.auctionID = b.auctionID 
                                WHERE b.buyerID = :buyerID AND b.auctionID = :auctionID AND b.price != 0 
                                AND b.buyerID != (SELECT b2.buyerID FROM bid AS b2
                                                WHERE b2.price = (SELECT MAX(b3.price) FROM bid as b3
                                                                WHERE b3.auctionID = b.auctionID)
                                                )');
       
        // Binding the provided parameters to our prepared statement.
        $stmnt->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
        $stmnt->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);

        $stmnt->execute();

        $data['outbid'] = array();
         while($row = $stmnt->fetch(PDO::FETCH_OBJ)){
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
