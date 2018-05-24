<?php
  require_once('connect_azure_db.php');

  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_STRING);

  try {
    $sql = 'SELECT * FROM feedback WHERE auctionID = :auctionID';
    $getFeedback = $pdo->prepare($sql);
    $getFeedback->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
    $getFeedback->execute();

    $data = $getFeedback->fetch(PDO::FETCH_OBJ);
    // Returning data as JSON.
    echo json_encode($data);
  }
  catch (Exception $e) {
    $error = $e->getMessage();
    die();
  }
?>
