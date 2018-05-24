<?php
  require_once('connect_azure_db.php');

  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $sellerID = filter_var($obj->sellerID, FILTER_SANITIZE_NUMBER_INT);

  try {

      //Get average rating
      $averageRatingQuery = 'SELECT AVG(f.buyerRating) AS average, u.username, COUNT(f.buyerRating) AS count 
                            FROM feedback AS f
                            JOIN `user` AS u ON f.sellerID = u.userID
                            WHERE f.sellerID = :sellerID';

      $getSellersAverage = $pdo->prepare($averageRatingQuery);
      $getSellersAverage->bindParam(':sellerID', $sellerID, PDO::PARAM_INT);
      $getSellersAverage->execute();
      $data = $getSellersAverage->fetch(PDO::FETCH_OBJ);

      echo json_encode($data);
  }
  catch (Exception $e) {
    $error = $e->getMessage();
    die();
  }
?>
