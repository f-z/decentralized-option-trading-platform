<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $buyerRating =  filter_var($obj->buyerRating, FILTER_SANITIZE_NUMBER_INT);
  $buyerComment =  filter_var($obj->buyerComment, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
  $buyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);
  $sellerID = filter_var($obj->sellerID, FILTER_SANITIZE_NUMBER_INT);
  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);

  try {
    $query = 'SELECT auctionID FROM `feedback` WHERE auctionID=:auctionID';
    $findFeedback = $pdo->prepare($query);
    $findFeedback->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);

    $findFeedback->execute();

    $result = $findFeedback->fetch(PDO::FETCH_OBJ);
    if (empty($result)){

        $sql = 'INSERT INTO `feedback` (buyerRating, buyerComment, buyerID, sellerID, auctionID) VALUES (:buyerRating, :buyerComment,  :buyerID, :sellerID, :auctionID)';

        $insertFeedback = $pdo->prepare($sql);

        $insertFeedback->bindParam(':buyerRating', $buyerRating, PDO::PARAM_INT);
        $insertFeedback->bindParam(':buyerComment', $buyerComment, PDO::PARAM_STR);
        $insertFeedback->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
        $insertFeedback->bindParam(':sellerID', $sellerID, PDO::PARAM_INT);
        $insertFeedback->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);

        $insertFeedback->execute();

        echo json_encode(array('message' => 'Congratulations, your feedback has been recorded!'));
    } 
    else{
      $sql = 'UPDATE `feedback` 
      SET buyerRating = :buyerRating, buyerComment= :buyerComment
      WHERE auctionID=:auctionID';

      $insertFeedback = $pdo->prepare($sql);
      $insertFeedback->bindParam(':buyerRating', $buyerRating, PDO::PARAM_STR);
      $insertFeedback->bindParam(':buyerComment', $buyerComment, PDO::PARAM_STR);
      $insertFeedback->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);


      $insertFeedback->execute();

      echo json_encode(array('message' => 'Congratulations, your feedback has been recorded!'));
    }
  } catch (Exception $e) {
    $error = $e->getMessage();
  }
?>
