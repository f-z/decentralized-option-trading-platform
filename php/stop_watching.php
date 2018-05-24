<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  // Sanitising URL supplied values.
  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
  $buyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);

  try {
    $sql = 'DELETE FROM `bid` WHERE auctionID = :auctionID AND buyerID = :buyerID';
    $query = $pdo->prepare($sql);
    $query->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
    $query->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
    $query->execute();

    echo json_encode(array('message' => 'You have stopped watching this item.'));
  }
  catch (Exception $e) {
    $error = $e->getMessage();
    die();
  }
?>
