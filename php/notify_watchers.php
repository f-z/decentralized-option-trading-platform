<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
  $newBid = filter_var($obj->highestBid, FILTER_SANITIZE_NUMBER_INT);
  $itemID = filter_var($obj->itemID, FILTER_SANITIZE_NUMBER_INT);

  try {
    // Search users who are watching this item
    $searchWatchers = 'SELECT u.firstName, u.email, i.name, b.auctionID, b.buyerID, b.price
    FROM user u
    JOIN bid b ON b.buyerID = u.userID
    AND b.price = 0
    JOIN auction a ON a.auctionID = b.auctionID
    AND a.auctionID = :auctionID
    AND a.endTime > NOW()
    JOIN item i ON a.itemID = i.itemID';

    $stmt = $pdo->prepare($searchWatchers);
    $stmt->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
    $stmt->execute();
    $watchers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($watchers)) {
        foreach ($watchers as $watcher) {
            $watcher_firstname = $watcher['firstName'];
            $watcher_email = $watcher['email'];
            $item_name = $watcher['name'];
            $auctionID = $watcher['auctionID'];
            $watcher_buyerID = $watcher['buyerID'];

            // Include file with mailer settings.
            require_once('email_server.php');

            $body = '
            <!doctype html>
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
                                  <p>Hi '.$watcher_firstname.',</p>
                                  <p>We are contacting you because you are watching '.$item_name.'.</p>
                                  <p>A new bid worth &pound;'.$newBid.' was submitted!</p>
                                  <p>Follow the link below to make a new bid and improve your chances of winning!</p>
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
            

            $mail->addBCC($watcher_email, $watcher_firstname);
            $mail->Subject = 'Someone made a bid on '.$item_name.'';
            $mail->Body = $body;
            $mail->IsHTML(true);

            if ($mail->send()) {
            echo ('Congratulations! '.$watcher_firstname.' has been notified!');
            }
        }
    }
 } catch (Exception $e) {
    echo json_encode('Message could not be sent! Mailer Error: ', $mail->ErrorInfo);
    die();
}
?>