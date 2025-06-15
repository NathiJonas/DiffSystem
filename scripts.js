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

function forgotPassword() {
    const email = prompt('Please enter your email address:');
    if (email) {
        alert('Password reset link has been sent to ' + email);
        // Here you would typically send the email to the server to handle the password reset process
    }
}
