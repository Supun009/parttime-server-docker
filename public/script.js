// Extract the token from the URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
document.getElementById('token').value = token;

// Handle the form submission
document.getElementById('resetForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const token = document.getElementById('token').value;
    const messageDiv = document.getElementById('message');

    try {
        console.error('send');
        const response = await fetch(`https://parttimejobs.web.lk/api/reset-password/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const result = await response.json();

        messageDiv.textContent = result.msg;
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred. Please try again.';
    }
});
