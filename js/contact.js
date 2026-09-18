document.getElementById('ajax-contact-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = this;
    const statusDiv = document.getElementById('form-status');

    // Get values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validate
    if (name === '' || email === '') {
        statusDiv.className =
            'p-4 mb-4 rounded-lg bg-red-100 text-red-800';

        statusDiv.textContent =
            'Please complete the required fields.';

        statusDiv.classList.remove('hidden');

        return;
    }

    // Collect form data
    const formData = new FormData(form);

    // Show sending message
    statusDiv.className =
        'p-4 mb-4 rounded-lg bg-blue-100 text-blue-800';

    statusDiv.textContent =
        'Sending message...';

    statusDiv.classList.remove('hidden');

    try {

        // Send data to PHP
        const response = await fetch('contact.php', {
            method: 'POST',
            body: formData
        });

        // Get JSON response from PHP
        const result = await response.json();

        if (result.success) {

            // Success
            statusDiv.className =
                'p-4 mb-4 rounded-lg bg-green-100 text-green-800';

            statusDiv.textContent =
                result.message;

            // Clear form
            form.reset();

        } else {

            // PHP returned an error
            statusDiv.className =
                'p-4 mb-4 rounded-lg bg-red-100 text-red-800';

            statusDiv.textContent =
                result.message ||
                'An error occurred. Please try again.';
        }

    } catch (error) {

        console.error(error);

        statusDiv.className =
            'p-4 mb-4 rounded-lg bg-red-100 text-red-800';

        statusDiv.textContent =
            'Could not connect to server.';
    }
});