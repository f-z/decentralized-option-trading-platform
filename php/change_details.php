<?php

require_once('connect_azure_db.php');

// Retrieving the posted data.
$json    =  file_get_contents('php://input');
$obj     =  json_decode($json);

$userID = filter_var($obj->userID, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
$username = filter_var($obj->username, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
$oldPassword = filter_var($obj->oldPassword, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
$hashedPass = sha1($oldPassword);

$query = 'SELECT password FROM user WHERE userID = :userID LIMIT 1';

$checkCredentials = $pdo->prepare($query);

// Binding the provided username to our prepared statement.
$checkCredentials->bindParam(':userID', $userID, PDO::PARAM_STR);

$checkCredentials->execute();

$row = $checkCredentials->fetch(PDO::FETCH_OBJ);

// Checking if $data is empty.
if ($row === false) {
    // Could not find a user with that username!
    // PS: You might want to handle this error in a more user-friendly manner!
    echo json_encode(array('message' => 'User does not exist!'));
    die ('User does not exist!');
} else {
    // Checking to see if the given password matches the hash stored in the user table.
    // Comparing the passwords.
    $storedPass = $row->password;

    // If password is verified as true, then the user can successfully log in.
    if ($hashedPass === $storedPass) {
        $street = filter_var($obj->street, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $city = filter_var($obj->city, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $postcode = filter_var($obj->postcode, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $phone = filter_var($obj->phone, FILTER_SANITIZE_NUMBER_INT);
        $DOB = filter_var($obj->DOB, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $photo = filter_var($obj->photo, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $password = filter_var($obj->password, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $hashedPassword = sha1($password);

        if ($password != null) {
            if ($photo != null) {
                $sql = 'UPDATE user SET username=:username, password=:password, DOB=:DOB, phone=:phone, street=:street, city=:city, postcode=:postcode, photo=:photo WHERE userID=:userID';
                $update = $pdo->prepare($sql);
                $update->bindParam(':photo', $photo, PDO::PARAM_STR);
            } else {
                $sql = 'UPDATE user SET username=:username, password=:password, DOB=:DOB, phone=:phone, street=:street, city=:city, postcode=:postcode WHERE userID=:userID';
                $update = $pdo->prepare($sql);
            }
            $update->bindParam(':password', $hashedPassword, PDO::PARAM_STR);

        } else {
            if ($photo != null) {
                $sql = 'UPDATE user SET username=:username, DOB=:DOB, phone=:phone, street=:street, city=:city, postcode=:postcode, photo=:photo WHERE userID=:userID';
                $update = $pdo->prepare($sql);
                $update->bindParam(':photo', $photo, PDO::PARAM_STR);
            } else {
                $sql = 'UPDATE user SET username=:username, DOB=:DOB, phone=:phone, street=:street, city=:city, postcode=:postcode WHERE userID=:userID';
                $update = $pdo->prepare($sql);
            }
        }

        // Binding parameter values to prepared statement.
        $update->bindParam(':userID', $userID, PDO::PARAM_STR);
        $update->bindParam(':username', $username, PDO::PARAM_STR);
        $update->bindParam(':DOB', $DOB, PDO::PARAM_STR);
        $update->bindParam(':phone', $phone, PDO::PARAM_STR);
        $update->bindParam(':street', $street, PDO::PARAM_STR);
        $update->bindParam(':city', $city, PDO::PARAM_STR);
        $update->bindParam(':postcode', $postcode, PDO::PARAM_STR);

        $update->execute();
        echo json_encode(array('message' => 'Congratulations, the record ' . $username . ' was added to the database!'));
    } else {
        // incorrect password
        echo json_encode(array('message' => 'Failed to update details'));
        die ('Incorrect password!');
    }
}
?>
