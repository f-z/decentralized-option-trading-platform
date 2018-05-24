<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);

    try{
        $query = 'SELECT COUNT(userID) AS distinctViewings, SUM(viewCount) AS totalViewings 
                    FROM `viewing` WHERE auctionID=:auctionID';
        
        $findViews = $pdo->prepare($query);
        $findViews->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
        $findViews->execute();
        $data = $findViews->fetch(PDO::FETCH_OBJ);
  
        echo json_encode($data);
    }
    catch (Exception $e) {
        $error = $e->getMessage();
        echo($error);
    }
?>