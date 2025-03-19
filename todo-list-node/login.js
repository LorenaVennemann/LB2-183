const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('./firebaseConfig');
const { getFirestore } = require('firebase-admin/firestore');

const router = express.Router();

// Firebase Admin SDK für serverseitige Authentifizierung
const serviceAccount = require("./login-183-firebase-adminsdk-fbsvc-6ca3379310.json");
const db = getFirestore();

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

// Firebase Client SDK für Auth
const clientApp = initializeApp(firebaseConfig);
const auth = getAuth(clientApp);

// HTML-Login-Seite rendern
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Login mit E-Mail & Passwort
router.post('/', async (req, res) => {
    let msg = '';
    let user = { username: '', userid: 0 };

    if (req.body.email && req.body.password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
            user.username = userCredential.user.email;
            user.userid = userCredential.user.uid;
            const idToken = await userCredential.user.getIdToken();
            res.cookie('idToken', idToken, { httpOnly: true, secure: false }); // secure: true in Produktion
            return res.json({ success: true, user });
        } catch (error) {
            msg = `Login fehlgeschlagen Email oder Passwort ist falsch`;
            return res.status(401).json({ error: msg });
        }
    }

    return res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });
});

// Google Login Verarbeitung
router.post('/google', async (req, res) => {
    try {
        const idToken = req.body.idToken;
        if (!idToken) {
            return res.status(400).json({ error: "Kein ID-Token gesendet" });
        }

        // Token mit Firebase Admin SDK verifizieren
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const user = await admin.auth().updateUser(decodedToken.uid, {
                    email: decodedToken.email,
                    emailVerified: true,
                    displayName: decodedToken.name
                }).catch(async error => {
                    if (error.code === 'auth/user-not-found') {
                        return await admin.auth().createUser({
                            uid: decodedToken.uid,
                            email: decodedToken.email,
                            displayName: decodedToken.name,
                            emailVerified: true
                        });
                    }
                    throw error;
                });

        const userDocRef = db.collection('users').doc(user.uid);
        await userDocRef.set({
             email: user.email,
             isAdmin: false
        });

        res.cookie('idToken', idToken, { httpOnly: true, secure: false });
        res.cookie('username', decodedToken.email);
        res.cookie('userid', decodedToken.uid);

        return res.json({ success: true });
    } catch (error) {
        console.error('Google Login Fehler:', error);
        return res.status(401).json({ error: `Login fehlgeschlagen: ${error.message}` });
    }
});

module.exports = router;
