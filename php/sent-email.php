<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $phone === '' || $message === '') {
    exit('Please fill in all fields.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('Please enter a valid email address.');
}

$mail = new PHPMailer(true);

try {
    // Enable verbose output to troubleshoot if it still fails
    // $mail->SMTPDebug = 2;

    $mail->isSMTP();
    
    // UPDATE THIS: Use your web host's SMTP server
    $mail->Host       = 'smtp.gmail.com'; 
    $mail->SMTPAuth   = true;
    $mail->Username   = 'seteam@nicemyanmartravel.com';
    $mail->Password   = 'qlehuebwetorzpkx'; 

    // Common cPanel SSL Settings (Port 465 + SMTPS)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; 
    $mail->Port       = 465;

    // Senders must match the authenticated Username
    $mail->setFrom('seteam@nicemyanmartravel.com', 'My Website');
    $mail->addAddress('thwel4186@gmail.com');
    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Message from ' . $name; 

    $mail->Body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
            <h2 style='color: #0066ff;'>New Contact Form Submission</h2>
            <hr style='border: none; border-top: 1px solid #eee; margin: 15px 0;' />
            <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
            <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
            <p><strong>Phone:</strong> " . htmlspecialchars($phone) . "</p>
            <p><strong>Message:</strong></p>
            <div style='background: #f9f9f9; padding: 15px; border-left: 4px solid #0066ff; margin-top: 10px;'>
                " . nl2br(htmlspecialchars($message)) . "
            </div>
        </div>
    ";

    $mail->send();
    echo "Message sent successfully!";

} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: " . $mail->ErrorInfo;
}