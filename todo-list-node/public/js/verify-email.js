document.getElementById('resendVerification').addEventListener('click', async function() {
    try {
        const user = firebase.auth().currentUser;
        if (user) {
            await user.sendEmailVerification();
            showMessage('Verification email has been resent!', 'success');
        } else {
            showMessage('You need to be logged in. Please refresh the page.', 'danger');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'danger');
    }
});

document.getElementById('refreshStatus').addEventListener('click', async function() {
    try {
        // Refresh the current user data
        await firebase.auth().currentUser.reload();
        const user = firebase.auth().currentUser;
        
        if (user.emailVerified) {
            showMessage('Your email has been verified! You can now set up two-factor authentication.', 'success');
            setTimeout(() => {
                window.location.href = '/setup-mfa';
            }, 2000);
        } else {
            showMessage('Your email is not verified yet. Please check your inbox and click the verification link.', 'warning');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'danger');
    }
});

function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = `alert alert-${type} mt-3`;
    messageElement.style.display = 'block';
}
