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

$sql = 'SELECT u.firstName, u.email, i.name, b.auctionID, b.buyerID, b.price, a.reservePrice
        FROM user u
        JOIN bid b ON b.buyerID = u.userID
        AND b.price = (SELECT max(b2.price) FROM bid b2, auction a2 WHERE b2.auctionID = b.auctionID)
        AND b.price > 0
        JOIN auction a ON a.auctionID = b.auctionID
        AND b.isNotified = 0
        AND a.endTime < NOW()
        JOIN item i ON a.itemID = i.itemID;';

$stmt = $pdo->prepare($sql);
$stmt->execute();
$bidders = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach($bidders as $bidder) {
    $firstname = $bidder['firstName'];
    $email = $bidder['email'];
    $item_name = $bidder['name'];
    $auctionID = $bidder['auctionID'];
    $buyerID = $bidder['buyerID'];
    $price = $bidder['price'];
    $reservePrice = $bidder['reservePrice'];

    try {
        // Server settings.
        $mail->isSMTP();
        $mail->SMTPDebug = 2;
        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 587;
        $mail->SMTPSecure = 'tls'; // enabling 'tls' to prevent security issues
        $mail->SMTPAuth = true;
        $mail->Username = 'uclbay.gc06@gmail.com';
        $mail->Password = 'uclbay@gc06';
        // Walk-around to bypass server errors.
        $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
            )
        );
        $mail->Debugoutput = 'html';
        $mail->setFrom('uclbay.gc06@gmail.com', '');

        $mail->addAddress($email, $firstname);
        $mail->Subject = 'Auction for '.$item_name.' has ended';

        if ($price >= $reservePrice) {
            $mail->Body = '<p>Hi '. $firstname.'</p>, 
                          <p>Congratualtions, you have won the auction for '.$item_name.'!</p>';
        
            if ($mail->send()){
                $sql2 = 'UPDATE bid SET isNotified = 1 WHERE auctionID = :auctionID AND buyerID = :buyerID;';
                $stmt2 = $pdo->prepare($sql2);
                $stmt2->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
                $stmt2->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
                $stmt2->execute();
            }

        } else {
            $mail->Body = 'Hi '. $firstname. ', 
                          You made the highest bid. Unfortunately, it did not meet the reserve price provided by the seller.';

            if ($mail->send()){
                $sql2 = 'UPDATE bid SET isNotified = 1 WHERE auctionID = :auctionID AND buyerID = :buyerID;';
                $stmt2 = $pdo->prepare($sql2);
                $stmt2->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
                $stmt2->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
                $stmt2->execute();
            }
        }
    } catch (Exception $e) {
        echo json_encode('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
        die();
    }
}
?>