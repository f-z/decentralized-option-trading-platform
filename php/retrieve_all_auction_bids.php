<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT); 

    try {
        // Retrieving item.
        $stmnt = $pdo->prepare('SELECT b.buyerID, b.price, b.time, u.username FROM user u, bid b
                                WHERE b.buyerID = u.userID
                                AND b.price > 0
                                AND b.auctionID = :auctionID;');
       
        // Binding the provided auction ID to our prepared statement.
        $stmnt->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);

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
