<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $name = filter_var($obj->name, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $photo = filter_var($obj->photo, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $description = filter_var($obj->description, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $condition = filter_var($obj->condition, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $quantity = filter_var($obj->quantity, FILTER_SANITIZE_NUMBER_INT);
    $categoryName = filter_var($obj->categoryName, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $sellerID = filter_var($obj->sellerID, FILTER_SANITIZE_NUMBER_INT);

    try {
        $itemQuery = "INSERT INTO item (`name`, `photo`, `description`, `condition`, `quantity`, `categoryName`, `sellerID`) VALUES (?, ?, ?, ?, ?, ?, ?)";

        $insertItem = $pdo->prepare($itemQuery);

        $insertItem->bindParam(1, $name, PDO::PARAM_STR);
        $insertItem->bindParam(2, $photo, PDO::PARAM_STR);
        $insertItem->bindParam(3, $description, PDO::PARAM_STR);
        $insertItem->bindParam(4, $condition, PDO::PARAM_STR);
        $insertItem->bindParam(5, $quantity,  PDO::PARAM_INT);
        $insertItem->bindParam(6, $categoryName, PDO::PARAM_STR);
        $insertItem->bindParam(7, $sellerID, PDO::PARAM_INT);

        $insertItem->execute();

        echo json_encode($pdo->lastInsertId());
      }
    catch (Exception $e) {
        $error = $e->getMessage();
    }
?>
