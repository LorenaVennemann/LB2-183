const express = require('express');
const path = require('path');
const { getFirestore } = require('firebase-admin/firestore');

const router = express.Router();
var admin = require("firebase-admin");
var serviceAccount = require("./login-183-firebase-adminsdk-fbsvc-6ca3379310.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = getFirestore();

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

router.post('/register', async (req, res) => {
    try {
        const userRecord = await admin.auth().createUser({
            email: req.body.email,
            password: req.body.password
        });

        // Speichere Benutzerinformationen in Firestore
        const userDocRef = db.collection('users').doc(userRecord.uid);
        await userDocRef.set({
            email: userRecord.email,
            isAdmin: false // Standardmässig kein Admin
        });

        res.redirect('/login');
    } catch (error) {
        console.error('Admin SDK Error:', error);
        res.status(400).send(`Error: ${error.message}`);
    }
});

router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;

        // Token verifizieren
        const decodedToken = await admin.auth().verifyIdToken(token);

        // User automatisch erstellen (Firebase erstellt ihn falls nicht existiert)
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

        // Speichere Benutzerinformationen in Firestore
        const userDocRef = db.collection('users').doc(user.uid);
        await userDocRef.set({
            email: user.email,
            isAdmin: false // Standardmässig kein Admin
        });

        // Einfache Erfolgsmeldung
        res.status(200).json({
            success: true,
            message: 'Registrierung erfolgreich',
            user: {
                uid: user.uid,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({
            success: false,
            error: 'Registrierung fehlgeschlagen: ' + error.message
        });
    }
});

module.exports = router;