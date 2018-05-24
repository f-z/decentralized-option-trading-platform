<?php
// Allowing access.
header('Access-Control-Allow-Origin: *');

// Defining database connection parameters.
$hn      = 'compgc06-team-30-server.mysql.database.azure.com';
$un      = 'team-30-admin@compgc06-team-30-server';
$pwd     = 'MariaDB?Really?';
$db      = 'compgc06_group30';
$cs      = 'utf8';

// Setting up the PDO parameters.
$dsn 	= "mysql:host=" . $hn . ";port=3306;dbname=" . $db . ";charset=" . $cs;
$opt 	= array(
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                );
try {
    // Creating a PDO instance (connecting to the database).
    $pdo 	= new PDO($dsn, $un, $pwd, $opt);   
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load composer's autoloader.
require_once('./vendor/autoload.php');

$selectSellers = 'SELECT a.auctionID, u.firstName, u.email, i.itemid, i.name
                    FROM user u, item i, auction a
                    WHERE u.userid = i.sellerID 
                    AND i.itemID = a.itemID 
                    AND a.endTime < NOW()
                    AND a.isNotified = 0';

$stmt = $pdo->prepare($selectSellers);
$stmt->execute();
$sellers = $stmt->fetchAll(PDO::FETCH_ASSOC);

// echo empty($sellers);
if (!empty($sellers)) {

    foreach($sellers as $seller) {

        $firstname = $seller['firstName'];
        $email = $seller['email'];
        $item_name = $seller['name'];
        $auctionID = $seller['auctionID'];

        $selectWinners = 'SELECT u.username, u.email, b.auctionID, b.buyerID, b.price, a.reservePrice
                        FROM user u, bid b, auction a
                        WHERE b.buyerID = u.userID
                        AND a.auctionID = b.auctionID
                        AND b.auctionID = :auctionID
                        AND b.price = (SELECT max(b2.price) FROM bid b2, auction a2 WHERE b2.auctionID = b.auctionID)
                        AND b.price > 0
                        AND a.endTime < NOW()';

        $stmt2 = $pdo->prepare($selectWinners);
        $stmt2->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
        $stmt2->execute();
        $winner = $stmt2->fetch(PDO::FETCH_ASSOC);

        $price = $winner['price'];
        $reservePrice = $winner['reservePrice'];
        $itemName = $winner['name'];

        // Server settings
        $mail->isSMTP();
        $mail->SMTPDebug = 2;
        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 587;
        $mail->SMTPSecure = 'tls'; // enable 'tls'  to prevent security issues
        $mail->SMTPAuth = true;
        $mail->Username = 'uclbay.gc06@gmail.com';
        $mail->Password = 'uclbay@gc06';
        // walkaround to bypass server errors
        $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
            )
        );
        $mail->Debugoutput = 'html';
        $mail->setFrom('uclbay.gc06@gmail.com', 'UCLBay');

        $mail->addAddress($email, $firstname);

        if ($price == null || $price == 0){

            $mail->Subject = 'Auction for '.$item_name.' ended';
            $mail->Body = 'Hi '.$firstname.', 
            Unfortunately, '.$item_name.' did not sell. Please relist your item for other users to be able to bid on it';
        } else if ($price >= $reservePrice) {

            $winnerName = $winner['username'];

            $mail->Subject = ''.$item_name.' was Sold!';
            $mail->Body = 'Hi '.$firstname.', 
                         '.$item_name.' has been sold for '.$price.'! The winner is '.$winnerName.'.';

        } else {
            $mail->Subject = 'Auction for '.$item_name.' ended';
            $mail->Body = 'Hi '.$firstname.', 
            Unfortunately, '.$item_name.' did not sell. The highest bid of '.$price.' did not exceed your reserve price.';

        }
        try {
            // echo $mail->Body;
            if ($mail->send()) {
                $sql2 = 'UPDATE auction SET isNotified = 1 WHERE auctionID = :auctionID;';
                $stmt2 = $pdo->prepare($sql2);
                $stmt2->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
                $stmt2->execute();
            }
        } catch (Exception $e) {
            echo json_encode('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
            die();
        }
    }
}
?>
