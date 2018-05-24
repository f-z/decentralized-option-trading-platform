<?php
// This script allows to specify email server settings.

// Import PHPMailer classes.
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load composer's autoloader.
require_once('./vendor/autoload.php');

// Create a new PHPMailer instance. Passing `true` enables exceptions.
$mail = new PHPMailer(true);

// Server settings
// Enable SMTP debug
// 0 = off (for production use)
// 1 = client messages
// 2 = client and server messages
$mail -> SMTPDebug = 2;

$mail->isSMTP();

// Set hostname.
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

// Set message sender.
$mail->setFrom('uclbay.gc06@gmail.com', 'UCLBay');
?>
