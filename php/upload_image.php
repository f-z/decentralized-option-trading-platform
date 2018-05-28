<?php
    require_once("connect_azure_db.php");
    $targetDir = "./uploads/";
    $result = "";
    $status = 200;
    $error = true;
    $imageName = generateRandomString(20);
    $targetFile = $targetDir . $imageName . basename($_FILES["photo"]["name"]);
    $uploadOk = 1;
    $imageFileType = pathinfo($targetFile, PATHINFO_EXTENSION);

    // Validating that the image file is a real image
    $validate = getimagesize($_FILES["photo"]["tmp_name"]);
    if($validate !== false) {
        $uploadOk = 1;
        // Checking that the image size is not too large
        if ($_FILES["photo"]["size"] > 5000000) {
            $result .= "Error: the image is too large!"; 
            $error =true;
            $uploadOk = 0;
        } else {
            // Checking that the image is in one of the accepted file formats
            if($imageFileType != "jpg" && $imageFileType != "jpeg" && $imageFileType != "png" && $imageFileType != "gif") {
                $error = true;
                $result .= "Error: please upload a JPG, JPEG, PNG, or GIF file!";
                $uploadOk = 0;
            } else {
                // Checking if there has been some other type of error
                if ($uploadOk == 0) {
                    $result .= "Error: the file has not been uploaded!";
                    $error = true;
                } else {
                    // If all checks pass, attempt to upload the image
                    $temp = explode(".", $_FILES["photo"]["name"]);
                    $uploadedFileName = $imageName . round(microtime(true)) . '.' . end($temp);
                    if (move_uploaded_file($_FILES["photo"]["tmp_name"], $targetDir . $uploadedFileName)) {
                        $result = 'https://okergo.azurewebsites.net/php/uploads/' . $uploadedFileName;
                        $status = 200;
                        $error = false;       
                    } else {
                        $error = true;
                        $result .= "Error: could not upload the image!";
                    }
                }
            }
        }
    }
    else {
        $result = "The file provided is not a real image!";
        $error = true;
        $uploadOk = 0;
    }

    echo json_encode($result);

    function generateRandomString($length = 20) {
        $characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $charactersLength = strlen($characters);
        $randomString = "";

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }
?>
