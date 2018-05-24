<?php
  require_once('connect_azure_db.php');

  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $sellerID = filter_var($obj->sellerID, FILTER_SANITIZE_NUMBER_INT);

  try {
      // Get feedback rows.
      $feedbackRowsQuery = 'SELECT f.auctionID, f.buyerRating AS rating, f.buyerComment AS comment, i.`name`, a.endTime, f.buyerID as userID, u.username
                            FROM feedback AS f 
                            INNER JOIN auction AS a ON f.auctionID = a.auctionID
                            INNER JOIN item AS i ON a.itemID = i.itemID
                            INNER JOIN `user` AS u ON f.buyerID = u.userID
                            WHERE f.sellerID = :sellerID';

      $getSellersFeedback = $pdo->prepare($feedbackRowsQuery);
      $getSellersFeedback->bindParam(':sellerID', $sellerID, PDO::PARAM_INT);
      $getSellersFeedback->execute();
      // Declaring an empty array to store the data we retrieve from the database in.
      $data[] = array();
      // First element of array is an array storing all of the feedback rows.
      $data['feedbackRows'] = array();
      // Fetching the row.
      while($row = $getSellersFeedback->fetch(PDO::FETCH_OBJ)) {
          // Assigning each row of data to an associative array.
          $data['feedbackRows'][] = $row;
        }

      // Get average rating.
      $averageRatingQuery = 'SELECT AVG(f.buyerRating) as average, u.username, COUNT(f.buyerRating) as count 
                            FROM feedback AS f
                            JOIN `user` AS u ON u.userID = f.sellerID
                            WHERE sellerID = :sellerID';

      $getSellersAverage = $pdo->prepare($averageRatingQuery);
      $getSellersAverage->bindParam(':sellerID', $sellerID, PDO::PARAM_INT);
      $getSellersAverage->execute();
      $data['average'] = $getSellersAverage->fetch(PDO::FETCH_OBJ);;

      echo json_encode($data);
  }
  catch (Exception $e) {
    $error = $e->getMessage();
    die();
  }
?>
