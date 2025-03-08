const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('./firebaseConfig');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function handleLogin(req, res) {
    let msg = '';
    let user = { 'username': '', 'userid': 0 };

    if (typeof req.body.email !== 'undefined' && typeof req.body.password !== 'undefined') {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
            user.username = userCredential.user.email;
            user.userid = userCredential.user.uid;
            const idToken = await userCredential.user.getIdToken();
            res.cookie('idToken', idToken, { httpOnly: true, secure: false }); // In production, set secure: true
            msg = 'Login successful';
        } catch (error) {
            msg = `Login failed: ${error.message}`;
        }
    }

    return { 'html': msg + getHtml(), 'user': user };
}

function startUserSession(res, user) {
    console.log('login valid... start user session now for userid ' + user.userid);
    res.cookie('username', user.username);
    res.cookie('userid', user.userid);
    res.redirect('/');
}

function getHtml() {
    return `
    <h2>Login</h2>
    <form id="form" method="post" action="/login">
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" class="form-control size-medium" name="email" id="email" required>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control size-medium" name="password" id="password" required>
        </div>
        <div class="form-group">
            <label for="submit" ></label>
            <input id="submit" type="submit" class="btn size-auto" value="Login" />
        </div>
    </form>`;
}

module.exports = {
    handleLogin: handleLogin,
    startUserSession: startUserSession
};