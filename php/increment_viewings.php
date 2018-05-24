<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
    $userID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT);

    try {

        $query = 'SELECT * FROM `viewing` WHERE auctionID = :auctionID AND userID = :userID';
        $findViews = $pdo->prepare($query);
        $findViews->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
        $findViews->bindParam(':userID', $userID, PDO::PARAM_INT);
        $findViews->execute();
        $result = $findViews->fetch(PDO::FETCH_OBJ);

        if (empty($result)) { // If the user has not viewed the auction before:

            $incrementQuery =  'INSERT INTO `viewing` (auctionID, userID, viewCount) 
                                VALUES (:auctionID, :userID, 1)';

            $incrementViewings = $pdo->prepare($incrementQuery);
            $incrementViewings->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
            $incrementViewings->bindParam(':userID', $userID, PDO::PARAM_INT); 
            $incrementViewings->execute();

         } else { // If the user has already viewed the auction:
            $incrementQuery = 'UPDATE viewing 
                               SET viewCount = viewCount + 1 
                               WHERE auctionID = :auctionID AND userID = :userID';

            $incrementViewings = $pdo->prepare($incrementQuery);
            $incrementViewings->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
            $incrementViewings->bindParam(':userID', $userID, PDO::PARAM_INT); 
            $incrementViewings->execute();
        }
  
        echo json_encode(array('message' => 'Viewings incremented'));
    }
    catch (Exception $e) {
        $error = $e->getMessage();
        echo($error);
    }
?>
