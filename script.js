// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Logout Button Logic
const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', () => {
    // Clear session storage or simulate logout
    sessionStorage.removeItem('userLoggedIn');
    alert('You have been logged out. Redirecting to login page...');
    window.location.href = 'login.html';
});

// Prevent Back Button After Logout
window.onload = () => {
    if (!sessionStorage.getItem('userLoggedIn')) {
        window.history.forward();
    }
};
