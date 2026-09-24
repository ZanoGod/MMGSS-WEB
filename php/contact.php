<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Contact Us</title>

    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <h1>Contact Us</h1>

    <form id="ajax-contact-form">
    <form action="send-mail.php" method="POST">

        <div>
            <label for="name">Name</label>

            <input
                type="text"
                id="name"
                name="name"
                required
            >
        </div>

        <div>
            <label for="company">Company Name</label>

            <input
                type="text"
                id="company"
                name="companyName"
                required
            >
        </div>

        <div>
            <label for="email">Email address</label>

            <input
                type="email"
                id="email"
                name="email"
                required
            >
        </div>

        <div>
            <label for="phone">Phone number</label>

            <input
                type="text"
                id="phone"
                name="phone"
                required
            >
        </div>

        <div>
            <label for="message">Please fill in your questions</label>

            <textarea
                id="message"
                name="message"
                rows="6"
                required
            ></textarea>
        </div>

        <button type="submit">
            Send Message
        </button>

    </form>
    </form>

</body>
</html>