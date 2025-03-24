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
    res.render(path.join(__dirname, 'views', 'register.ejs'));
});

router.post('/register', async (req, res) => {
    try {
        // Honeypot-Feld prüfen
        if (req.body.honeypot) {
            return res.status(400).json({ error: 'Bot detected' });
        }

        // Verifiziere das ID-Token, das vom Client gesendet wurde
        const decodedToken = await admin.auth().verifyIdToken(req.body.idToken);
        const uid = decodedToken.uid;

        // Speichere Benutzerinformationen in Firestore
        const userDocRef = db.collection('users').doc(uid);
        await userDocRef.set({
            email: decodedToken.email,
            isAdmin: false
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Admin SDK Error');
        res.status(400).json({ error: `Fehler beim Registrieren` });
    }
});

module.exports = router;