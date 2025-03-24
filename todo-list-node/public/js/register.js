document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const honeypot = document.getElementById('honeypot').value;
    const errorDiv = document.getElementById('error-message');
    const submitButton = document.querySelector('#registerForm button[type="submit"]');
    
    // Simple validation
    if (!email || !password) {
        errorDiv.textContent = 'Please enter email and password';
        return;
    }
    
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters';
        return;
    }
    
    if (honeypot) {
        errorDiv.textContent = 'Bot detected';
        return;
    }
    
    try {
        // Disable submit button to prevent multiple submissions
        submitButton.disabled = true;
        
        // Create user with Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Get ID token
        const idToken = await user.getIdToken();
        
        // Register with our server
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email, 
                idToken,
                honeypot
            })
        });
        
        if (response.ok) {
            window.location.href = '/login';
        } else {
            const data = await response.json();
            errorDiv.textContent = data.error;
        }
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            errorDiv.textContent = 'The email address is already in use by another account.';
        } else {
            errorDiv.textContent = `Registration error: ${error.message}`;
        }
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
    }
});