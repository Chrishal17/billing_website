// Login Form Validation
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if ((username === 'Chris Halden' && password === 'itz_me_halden') || (username === 'Hal Power' && password === '9962614327')) {
        errorMessage.style.color = 'green';
        errorMessage.textContent = 'Login successful!';
        setTimeout(() => {
            window.location.href = 'main.html'; // Redirect after login
        }, 1000);
    } else {
        errorMessage.textContent = 'Invalid username or password. Please try again.';
    }
});
