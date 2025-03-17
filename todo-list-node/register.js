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

module.exports = router;