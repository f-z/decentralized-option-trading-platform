<?php
  require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
    $highestBidderID = filter_var($obj->prevBidderID, FILTER_SANITIZE_NUMBER_INT);
    $newBuyerID = filter_var($obj->newBuyer, FILTER_SANITIZE_NUMBER_INT);
    $itemID = filter_var($obj->itemID, FILTER_SANITIZE_NUMBER_INT);

    try {
        if (!($highestBidderID == $newBuyerID)) {
            // Retrieving userID of previous highest bidder.
            $sql = 'SELECT firstName, email FROM user
            WHERE userID = :buyerID';
            $retrieveBidder = $pdo->prepare($sql);
            $retrieveBidder->bindParam(':buyerID', $highestBidderID, PDO::PARAM_INT);
            $retrieveBidder->execute();
            $prevBidder = $retrieveBidder->fetch(PDO::FETCH_ASSOC);
             
            $emailPrev = $prevBidder['email'];
            $namePrev = $prevBidder['firstName'];
                
            $mail = new PHPMailer(true);
            
            // Server settings
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
                                  <p>Hi '.$namePrev.',</p>
                                  <p>You were outbid! Do not hesitate to jump back in! The item is still up for grabs!</p>
                                  <p>Follow the link below to make a new bid.</p>
                                    <tbody>
                                        <tr>
                                          <td> <a href="https://ucl-group30.azurewebsites.net/items/'.$auctionID.'" target="_blank">View Item</a> </td>
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

            $mail->addAddress($emailPrev, $namePrev);
            $mail->Subject = 'You were outbid!';
            $mail->IsHTML(true);
            $mail->Body = $body;
            
            'Hi '.$namePrev.', 
                             You were outbid! Do not hesitate to jump back in! The item is still up for grabs!';  
                 
            if ($mail->send()){
                echo json_encode('Email to previous bidder has been sent!');
            }
        } else {
            echo json_encode('You are previous bidder');
        }
    } catch (Exception $e) {
        echo json_encode('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
        die();
    }
?>
