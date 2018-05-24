<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  // Sanitising URL supplied values.
  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);

  try {
    // Selecting the count of both those buyers who have bid on the item
    // and those who are just watching the auction (bids of 0).
    $sql = 'SELECT COUNT(DISTINCT buyerID) AS watchers FROM bid WHERE auctionID = :auctionID';
    $retrieveCount = $pdo->prepare($sql);
    $retrieveCount->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
    $retrieveCount->execute();

    $data= $retrieveCount->fetch(PDO::FETCH_OBJ);

    // Returning data as JSON.
    echo json_encode($data);
  }
  catch (Exception $e) {
    $error = $e->getMessage();
    die();
  }
?>
