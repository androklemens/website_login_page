document.addEventListener('DOMContentLoaded', () => {
    // Toggle between login and register forms
    const logregBox = document.querySelector('.logreg-box');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');

    if (registerLink && loginLink) {
        registerLink.addEventListener('click', () => {
            logregBox.classList.add('active');
        });

        loginLink.addEventListener('click', () => {
            logregBox.classList.remove('active');
        });
    }

    // Handle form submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgetPasswordForm = document.querySelector('.forget-password-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('http://localhost:4000/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                alert(data.message);
                if (response.ok) {
                    window.location.href = 'welcome.html';  // Redirect ke halaman selamat datang
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            try {
                const response = await fetch('http://localhost:4000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();
                alert(data.message);
                if (response.ok) {
                    window.location.href = 'welcome.html';  // Redirect ke halaman selamat datang
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (forgetPasswordForm) {
        forgetPasswordForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('forget-password-email').value;

            try {
                const response = await fetch('http://localhost:4000/forget-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                alert(data.message);
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Fungsi logout
    function logout() {
        window.location.href = 'logout.html';  // Redirect ke halaman logout.html saat logout
    }

    // Attach logout function to the button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
