// Globale Variablen
let resolver;
let recaptchaVerifier;

// Initialize reCAPTCHA verifier
function initRecaptcha() {
    if (!recaptchaVerifier) {
        recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'normal',
            'callback': function() {
                // reCAPTCHA solved, continue with login
                console.log('reCAPTCHA solved');
            }
        });
        recaptchaVerifier.render();
    }
}

// Warte, bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Initialisiere reCAPTCHA
    initRecaptcha();

    // Google Login
    document.getElementById('googleSignIn').addEventListener('click', async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        
        try {
            const result = await firebase.auth().signInWithPopup(provider);
            const idToken = await result.user.getIdToken();
            
            const response = await fetch('/login/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            });
            
            if (response.ok) {
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
        } catch (error) {
            document.getElementById('error-message').textContent = error.message;
        }
    });

    // Email Login
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error-message');
        
        if (!email || !password) {
            errorDiv.textContent = 'Please enter email and password';
            return;
        }
        
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
                .then(async (userCredential) => {
                    // Get ID token and send to server
                    const idToken = await userCredential.user.getIdToken();
                    
                    const response = await fetch('/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password, idToken })
                    });
                    
                    if (response.ok) {
                        window.location.href = '/';
                    } else {
                        const data = await response.json();
                        errorDiv.textContent = data.error;
                    }
                })
                .catch(function(error) {
                    if (error.code === 'auth/multi-factor-auth-required') {
                        // Handle MFA
                        handleMFA(error);
                    } else {
                        errorDiv.textContent = `Login failed: ${error.message}`;
                    }
                });
        } catch (error) {
            errorDiv.textContent = `Error: ${error.message}`;
        }
    });

    // Verify MFA code
    document.getElementById('verifyMfaCode').addEventListener('click', async function() {
        const verificationCode = document.getElementById('verificationCode').value;
        const errorDiv = document.getElementById('mfa-error-message');
        
        if (!verificationCode) {
            errorDiv.textContent = 'Please enter verification code';
            return;
        }
        
        try {
            // Create phone credential
            const cred = firebase.auth.PhoneAuthProvider.credential(window.verificationId, verificationCode);
            
            // Create multi-factor assertion
            const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(cred);
            
            // Complete sign-in
            const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
            
            // Get ID token and send to server
            const idToken = await userCredential.user.getIdToken();
            
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            });
            
            if (response.ok) {
                window.location.href = '/';
            } else {
                const data = await response.json();
                errorDiv.textContent = data.error;
            }
        } catch (error) {
            errorDiv.textContent = `Error verifying code: ${error.message}`;
        }
    });
});

// Handle MFA
function handleMFA(error) {
    // Hide login form
    document.getElementById('loginForm').style.display = 'none';
    
    // Show MFA container
    document.getElementById('mfaContainer').style.display = 'block';
    
    // Store the resolver
    resolver = error.resolver;
    
    // Get MFA
    const selectedHint = resolver.hints[0];
    
    // Create phone info options
    const phoneInfoOptions = {
        multiFactorHint: selectedHint,
        session: resolver.session
    };
    
    // Send verification code
    const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
    phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
        .then(function(verificationId) {
            // Store verification ID
            window.verificationId = verificationId;
        })
        .catch(function(error) {
            document.getElementById('mfa-error-message').textContent = `Error sending verification code: ${error.message}`;
            
            // Bei Fehler reCAPTCHA zurücksetzen
            if (recaptchaVerifier) {
                recaptchaVerifier.clear();
                recaptchaVerifier = null;
                initRecaptcha();
            }
        });
}

// Refresh ID token periodically
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        setInterval(async () => {
            const idToken = await user.getIdToken(true); // Force refresh
            document.cookie = `idToken=${idToken}; path=/;`;
        }, 30 * 60 * 1000); // Refresh every 30 minutes
    }
});