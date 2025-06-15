function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const spinner = document.querySelector('.spinner');

    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        if (username === 'teacher' && password === 'password') {
            alert('Login successful!');
            // Redirect to differentiated assessment tool dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials, please try again.');
        }
    }, 2000); // Simulate a 2-second loading time
}

function showForgotPasswordForm() {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.forgot-password-container').style.display = 'block';
}

function requestPasswordReset() {
    const email = document.getElementById('email').value;
    fetch('/request-password-reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
}
