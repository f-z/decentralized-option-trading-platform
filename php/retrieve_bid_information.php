<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  // Sanitising URL supplied values.
  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_STRING);

  try {
    // $sql = 'SELECT COUNT(bidID) AS count, MAX(price) as highest FROM bid WHERE auctionID = :auctionID;';

    $sql = 'SELECT COUNT(bidID) AS count FROM bid WHERE auctionID = :auctionID AND price != 0;';
    $retrieveCount = $pdo->prepare($sql);
    $retrieveCount->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
    $retrieveCount->execute();

    // Declaring an empty array to store the data we retrieve from the database in.
    $data = array();

    $data['count'] = $retrieveCount->fetch(PDO::FETCH_OBJ);

    $sql2 = 'SELECT price AS highestBid, buyerID FROM bid
          WHERE `auctionID`= :auctionID
          AND price > 0
          AND price = (select MAX(price) FROM bid where `auctionID` = :auctionID2);';

    $retrieveBid = $pdo->prepare($sql2);
    $retrieveBid->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
    $retrieveBid->bindParam(':auctionID2', $auctionID, PDO::PARAM_INT);
    $retrieveBid->execute();

    $data['bid'] = $retrieveBid->fetch(PDO::FETCH_OBJ);

    // Returning data as JSON.
    echo json_encode($data);
  }
  catch (Exception $e) {
    $error = $e->getMessage();
    die();
  }
?>
