<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values
    $username = filter_var($obj->username, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $email	  = filter_var($obj->email, FILTER_SANITIZE_EMAIL);

    // Attempting to query database table
   try {
        $stmnt = $pdo->prepare('SELECT username, email FROM user WHERE username = :username OR email = :email LIMIT 1');
        
        // Binding the provided username to our prepared statement.
        $stmnt->bindParam(':username', $username, PDO::PARAM_STR);

        // Binding the provided email to our prepared statement.
        $stmnt->bindParam(':email', $email, PDO::PARAM_STR);

        $stmnt->execute();
        
        // Fetching the row.
        while($row = $stmnt->fetch(PDO::FETCH_OBJ)) {
           // Assigning each row of data to an associative array.
           $data[] = $row;
        }
     }
     catch(PDOException $e) {
        echo $e->getMessage();
        die();
     }

    // Checking if user already exists in database
    if($data != null) {
        die('Το όνομα χρήστη ή το email είναι ήδη σε χρήση!');
    }
    else {
        try {
            $password = filter_var($obj->password, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
            $hashedPass = sha1($password);
            $firstName = filter_var($obj->firstName, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
            $lastName = filter_var($obj->lastName, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
            $region = filter_var($obj->region, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
            $phone = filter_var($obj->phone, FILTER_SANITIZE_NUMBER_INT);
            $photo = filter_var($obj->photo, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
            $registrationNumber = filter_var($obj->registrationNumber, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);

            $sql = 'INSERT INTO user(username, password, photo, firstName, lastName, email, phone, region, registrationNumber) VALUES (:username, :password, :photo, :firstname, :lastname, :email, :region, :registrationNumber)';

            $insert = $pdo->prepare($sql);

            // Binding parameter values to prepared statement
            $insert->bindParam(':username', $username, PDO::PARAM_STR);
            $insert->bindParam(':email', $email, PDO::PARAM_STR);
            $insert->bindParam(':password', $hashedPass, PDO::PARAM_STR);
            $insert->bindParam(':firstname', $firstName, PDO::PARAM_STR);
            $insert->bindParam(':lastname', $lastName, PDO::PARAM_STR);
            $insert->bindParam(':photo', $photo, PDO::PARAM_STR);
            $insert->bindParam(':phone', $phone, PDO::PARAM_INT);
            $insert->bindParam(':region', $region, PDO::PARAM_STR);
            $insert->bindParam(':registrationNumber', $registrationNumber, PDO::PARAM_STR);

            $insert->execute();
            echo json_encode(array('message' => 'Συγχαρητήρια, ο χρήστης ' . $username . ' δημιουργήθηκε επιτυχώς!'));
        }
        // Catching any errors in running the prepared statement
        catch(PDOException $ex) {
           echo $ex->getMessage();
        }
    }
?>
