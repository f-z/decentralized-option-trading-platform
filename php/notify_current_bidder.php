<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
  $currentBuyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);
  $newBid = filter_var($obj->highestBid, FILTER_SANITIZE_NUMBER_INT);
  $itemID = filter_var($obj->itemID, FILTER_SANITIZE_NUMBER_INT);

  try {
    // Retrieving contact details of new highest bidder.
    $sql2 = 'SELECT firstName, email FROM user WHERE `userID`= :buyerID';

    $retrieveEmailCurr = $pdo->prepare($sql2);
    $retrieveEmailCurr->bindParam(':buyerID', $currentBuyerID, PDO::PARAM_INT);
    $retrieveEmailCurr->execute();

    $stmtCur = $retrieveEmailCurr->fetch(PDO::FETCH_ASSOC);

    $firstname = $stmtCur['firstName'];
    $emailCur = $stmtCur['email'];
     
    // Getting current date and time (in London, UK, timezone).
    $timezone = 'Europe/London';
    $timestamp = time();
    $currentTime = new DateTime("now", new DateTimeZone($timezone));
    $currentTime->setTimestamp($timestamp);
    $time = $currentTime->format('Y-m-d H:i:s');
     
    // Include file with mailer settings
    require_once('email_server.php');

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
                          <p>You are currently the highest bidder ('.$time.')!</p>
                          <p>Looking good so far. It is almost yours, but you could still be outbid. You can improve your chances by increasing your max bid.</p>
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
    
    $mail->addAddress($emailCur, $firstname);
    $mail->Subject = 'Your bid is winning';
    $mail->IsHTML(true);
    $mail->Body = $body;
        
    if($mail->send()) {
      echo json_encode('Email to current bidder has been sent!');
    }
    } catch (Exception $e) {
       echo json_encode('Message could not be sent! Mailer Error: ', $mail->ErrorInfo);
       die();
   }
?>
