<?php
    require_once('connect_azure_db.php');

   // Declaring an empty array to store the data we retrieve from the database in.
    $data = array();

    // Attempting to query database table and retrieve data.
    try {
       $results = $pdo->query('SELECT * FROM category ORDER BY categoryName');
       
       while($row = $results->fetch(PDO::FETCH_OBJ)) {
          // Assigning each row of data to associative array.
          $data[] = $row;
      }

      // Returning data as JSON.
      echo json_encode($data);
    }
    // Catching potential exceptions being thrown.
    catch(PDOException $e) {
       echo $e->getMessage();
    }
?>
