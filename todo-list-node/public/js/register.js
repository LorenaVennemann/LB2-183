document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const honeypot = document.getElementById('honeypot').value;
    const errorDiv = document.getElementById('error-message');
    const submitButton = document.querySelector('#registerForm button[type="submit"]');
    const result = zxcvbn(password);

    // Simple validation
    if (!email || !password) {
        errorDiv.textContent = 'Please enter email and password';
        return;
    }
    
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        return;
    }
    
    if (password.length < 12) {
        errorDiv.textContent = 'Password must be at least 12 characters';
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%()*+,\-./:;=?@[\]^_{|}~]).+$/;
    if (!passwordRegex.test(password)) {
        errorDiv.textContent = 'Password must include uppercase, lowercase, number, and special character (!#$%()*+,-./:;=?@[]^_{|}~)';
        return;
    }
    
    if (honeypot) {
        errorDiv.textContent = 'Bot detected';
        return;
    }

    if (result.score < 3) {
        errorDiv.textContent = 'Please choose a stronger password';
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

document.getElementById('password').addEventListener('input', (event) => {
    console.log(event.target.value);
    const passwordStrengthDiv = document.getElementById('password-strength-div');

    if(event.target.value) {
        passwordStrengthDiv.style.display = 'block';

        const result = zxcvbn(event.target.value);
        const strengthMeter = document.getElementById('password-strength');
        const strengthText = document.getElementById('password-strength-text');

        // Set progress bar value (0 - 4)
        strengthMeter.value = result.score;

        // Feedback text and color
        const feedback = [
            { text: 'Sehr schwach', color: 'red' },
            { text: 'Schwach', color: 'orangered' },
            { text: 'Okay', color: 'orange' },
            { text: 'Gut', color: 'yellowgreen' },
            { text: 'Stark', color: 'green' }
        ];

        strengthText.textContent = feedback[result.score].text;
        strengthText.style.color = feedback[result.score].color;
        strengthMeter.style.accentColor = feedback[result.score].color;       
    } else {
        passwordStrengthDiv.style.display = 'none';
    }
});