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

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = getFirestore();

// Firebase Client SDK für Auth
const clientApp = initializeApp(firebaseConfig);
const auth = getAuth(clientApp);

// HTML-Login-Seite rendern
router.get('/', (req, res) => {
    res.render(path.join(__dirname, 'views', 'login.ejs'));
});

// Login mit E-Mail & Passwort
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });
    }
    let msg = '';
    let user = { username: '', userid: 0 };

    if (req.body.idToken) {
        // MFA-Login oder bereits authentifizierter Benutzer
        try {
            const decodedToken = await admin.auth().verifyIdToken(req.body.idToken);
            user.username = decodedToken.email;
            user.userid = decodedToken.uid;
            
            res.cookie('idToken', req.body.idToken, { httpOnly: true, secure: false }); // secure: true in Produktion
            res.cookie('username', user.username);
            res.cookie('userid', user.userid);
            
            return res.json({ success: true, user });
        } catch (error) {
            return res.status(401).json({ error: `Token-Verifizierung fehlgeschlagen: ${error.message}` });
        }
    } else if (req.body.email && req.body.password) {
        // Standardlogin mit E-Mail und Passwort
        try {
            const userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
            user.username = userCredential.user.email;
            user.userid = userCredential.user.uid;
            const idToken = await userCredential.user.getIdToken();
            
            res.cookie('idToken', idToken, { httpOnly: true, secure: false }); // secure: true in Produktion
            res.cookie('username', user.username);
            res.cookie('userid', user.userid);
            
            return res.json({ success: true, user });
        } catch (error) {
            if (error.code === 'auth/multi-factor-auth-required') {
                // MFA ist erforderlich, aber wir können keine vollständigen Resolver-Daten zurücksenden
                // Client muss dies selbst behandeln
                return res.status(401).json({ error: 'MFA erforderlich' });
            } else {
                msg = `Login fehlgeschlagen`;
                return res.status(401).json({ error: msg });
            }
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
        }, { merge: true });

        res.cookie('idToken', idToken, { httpOnly: true, secure: false });
        res.cookie('username', decodedToken.email);
        res.cookie('userid', decodedToken.uid);

        return res.json({ success: true });
    } catch (error) {
        console.error('Google Login Fehler');
        return res.status(401).json({ error: `Login fehlgeschlagen, versuche es später erneut` });
    }
});

module.exports = router;