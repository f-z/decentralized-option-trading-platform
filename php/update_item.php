<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $itemID =  filter_var($obj->itemID, FILTER_SANITIZE_NUMBER_INT);
  // Sanitising URL supplied values.
  $name = filter_var($obj->name, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
  $photo = filter_var($obj->photo, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
  $description = filter_var($obj->description, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
  $condition = filter_var($obj->condition, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
  $quantity = filter_var($obj->quantity, FILTER_SANITIZE_NUMBER_INT);
  $categoryName = filter_var($obj->categoryName, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
  $sellerID = filter_var($obj->sellerID, FILTER_SANITIZE_NUMBER_INT);
                
    // Inserting new bid
       try {
        $itemQuery = "UPDATE `compgc06_group30`.`item` 
        SET name=:name, photo=:photo, description=:description, `condition`= :condition, quantity=:quantity, categoryName=:categoryName
        WHERE itemID=:itemID ";

        $insertItem = $pdo->prepare($itemQuery);

        $insertItem->bindParam(':name', $name, PDO::PARAM_STR);
        $insertItem->bindParam(':photo', $photo, PDO::PARAM_STR);
        $insertItem->bindParam(':description', $description, PDO::PARAM_STR);
        $insertItem->bindParam(':condition', $condition, PDO::PARAM_STR);
        $insertItem->bindParam(':quantity', $quantity,  PDO::PARAM_INT);
        $insertItem->bindParam(':categoryName', $categoryName, PDO::PARAM_STR);
        $insertItem->bindParam(':itemID', $itemID, PDO::PARAM_INT);

        $insertItem->execute();

        echo json_encode($itemID);
      }
    catch (Exception $e) {
        $error = $e->getMessage();
    }
?>
