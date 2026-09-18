<?php
declare(strict_types=1);

// Replace this with the official mailbox that should receive inquiries.
$recipient = 'info@myanmargss.com';
$siteName = 'Myanmar GSS Co., Ltd.';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed.');
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? ''));

if ($name === '' || $subject === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit('Please enter a valid name, email address, and subject.');
}

$name = mb_substr($name, 0, 120);
$email = mb_substr($email, 0, 190);
$phone = mb_substr($phone, 0, 60);
$subject = mb_substr($subject, 0, 180);

// Prevent header injection through user-controlled values.
$name = str_replace(["\r", "\n"], ' ', $name);
$email = str_replace(["\r", "\n"], '', $email);
$phone = str_replace(["\r", "\n"], ' ', $phone);
$subject = str_replace(["\r", "\n"], ' ', $subject);

$mailSubject = '[Website Contact] ' . $subject;
$message = "New contact inquiry from {$siteName}\n\n" .
    "Name: {$name}\n" .
    "Email: {$email}\n" .
    "Phone: " . ($phone !== '' ? $phone : 'Not provided') . "\n" .
    "Subject: {$subject}\n\n" .
    "Reply directly to: {$email}\n";

$headers = [
    'From: website@myanmargss.com',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($recipient, $mailSubject, $message, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    exit('Unable to send your inquiry right now. Please try again later.');
}

header('Location: contact.html?status=success', true, 303);
exit;
