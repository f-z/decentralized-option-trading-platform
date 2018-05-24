<?php
  require_once('connect_azure_db.php');

  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $buyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);

  try {
      // Get feedback rows.
      $feedbackRowsQuery = 'SELECT f.auctionID, f.sellerRating AS rating, f.sellerComment AS comment, a.endTime, f.sellerID as userID, u.username
                            FROM feedback AS f 
                            INNER JOIN auction AS a ON f.auctionID = a.auctionID
                            INNER JOIN item AS i ON a.itemID = i.itemID
                            INNER JOIN `user` AS u ON f.sellerID = u.userID
                            WHERE f.buyerID = :buyerID';

      $getbuyersFeedback = $pdo->prepare($feedbackRowsQuery);
      $getbuyersFeedback->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
      $getbuyersFeedback->execute();
      // Declaring an empty array to store the data we retrieve from the database in.
      $data[] = array();
      // First element of array is an array storing all of the feedback rows.
      $data['feedbackRows'] = array();
      // Fetching the row.
      while($row = $getbuyersFeedback->fetch(PDO::FETCH_OBJ)) {
          // Assigning each row of data to an associative array.
          $data['feedbackRows'][] = $row;
        }

      // Get average rating.
      $averageRatingQuery = 'SELECT AVG(f.sellerRating) as average, COUNT(f.sellerRating) as count 
                            FROM feedback AS f
                            WHERE buyerID = :buyerID';

      $getBuyersAverage = $pdo->prepare($averageRatingQuery);
      $getBuyersAverage->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
      $getBuyersAverage->execute();
      $data['average'] = $getBuyersAverage->fetch(PDO::FETCH_OBJ);

      echo json_encode($data);
  }
  catch (Exception $e) {
    $error = $e->getMessage();
    die();
  }
?>
