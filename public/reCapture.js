 function onSubmit(e) {
            e.preventDefault();
            const response = grecaptcha.getResponse();
            if (response.length === 0) {
                alert('Please complete the CAPTCHA');
                return;
            }

            fetch('/verify-captcha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ response })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect to the download link with token
                    window.location.href = `/download/${data.token}`;
                } else {
                    alert('CAPTCHA verification failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        }