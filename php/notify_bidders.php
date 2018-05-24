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

$sql = 'SELECT u.firstName, u.email, i.name, i.itemID, b.auctionID, b.buyerID
        FROM user u
        JOIN bid b ON b.buyerID = u.userID
        AND b.price != (SELECT max(b2.price) FROM bid b2, auction a2 WHERE b2.auctionID = b.auctionID)
        AND b.price > 0
        JOIN auction a ON a.auctionID = b.auctionID
        AND b.isNotified = 0
        AND a.endTime < NOW()
        JOIN item i ON a.itemID = i.itemID
        GROUP BY u.userID;';

$stmt = $pdo->prepare($sql);
$stmt->execute();
$bidders = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach($bidders as $bidder){

    $firstname = $bidder['firstName'];
    $email = $bidder['email'];
    $item_name = $bidder['name'];
    $auctionID = $bidder['auctionID'];
    $buyerID = $bidder['buyerID'];
    $itemID = $bidder['itemID'];

    $sql2 = 'SELECT max(b.price) AS maxBid FROM bid b, auction a
            WHERE b.auctionID = :auctionID';

        $stmt2 = $pdo->prepare($sql2);
        $stmt2->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
        $stmt2->execute();
        $bid = $stmt2->fetch(PDO::FETCH_ASSOC);

        $maxBid = $bid['maxBid'];

    try {
        $mail = new PHPMailer(true);
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

        $body = '<!doctype html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            </head>
            <body class="">
              <table border="0" cellpadding="0" cellspacing="0" class="body">
                <tr>
                  <td>&nbsp;</td>
                  <td class="container">
                    <div class="content">
            
                      <table class="main">
                        <tr>
                          <td class="wrapper">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td>
                                  <p>Hi '.$firstname.',</p>
                                  <p>This item is unfortunately now sold for &pound;'.$maxBid.', but there is more!</p>
                                  <p>Follow the link below to bid on other items.</p>
                                    <tbody>
                                        <tr>
                                          <td> <a href="https://ucl-group30.azurewebsites.net/" target="_blank">Visit UCLBay</a> </td>
                                        </tr>
                                    </tbody>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <br>
                      <div class="footer">
                        <span>
                            <b>UCLBay</b>
                            <br>
                            Gower Street
                            <br>
                            London
                            <br>
                            WC1B 6BE
                            </span>
                      </div>
            
                    </div>
                  </td>
                  <td>&nbsp;</td>
                </tr>
              </table>
            </body>
            </html>';

        $mail->addAddress($email, $firstname);
        $mail->Subject = ''.$item_name.' was sold';
        $mail->IsHTML(true);
        $mail->Body = $body;
        
        if ($mail->send()){
            $sql3 = 'UPDATE bid SET isNotified = 1 WHERE auctionID = :auctionID AND buyerID = :buyerID;';
            $stmt3 = $pdo->prepare($sql3);
            $stmt3->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
            $stmt3->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
            $stmt3->execute();
        }
    } catch (Exception $e) {
        echo json_encode('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
        die();
    }
}
?>
