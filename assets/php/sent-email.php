<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../vendor/autoload.php';
require 'vendor/autoload.php';

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $phone === '' || $message === '') {
    exit('Please fill in all fields.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('Please enter a valid email address.');
}

$mail = new PHPMailer(true);

try {

    // SMTP configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;

    $mail->Username = getenv('MMGSS_SMTP_USERNAME') ?: '';
    $mail->Password = getenv('MMGSS_SMTP_PASSWORD') ?: '';

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 587;

    // Sender
    $mail->setFrom(
        'seteam@nicemyanmartravel.com',
        'My Website'
    );

    // Recipient
    $mail->addAddress(
        'thwel4186@gmail.com'
    );

    // Visitor's email
    $mail->addReplyTo(
        $email,
        $name
    );

    // Email content
    $mail->isHTML(true);

    $mail->Subject = $subject;

    $mail->Body = "
        <h2>New Contact Form Message</h2>

        <p>
            <strong>Name:</strong>
            " . htmlspecialchars($name) . "
        </p>

        <p>
            <strong>Email:</strong>
            " . htmlspecialchars($email) . "
        </p>

        <p>
            <strong>Phone:</strong>
            " . htmlspecialchars($phone) . "
        </p>

        <p>
            <strong>Message:</strong>
        </p>

        <p>
            " . nl2br(htmlspecialchars($message)) . "
        </p>
    ";

    $mail->send();

    echo "Message sent successfully!";

} catch (Exception $e) {

    echo "Message could not be sent.";
}
