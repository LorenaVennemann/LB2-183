const admin = require("firebase-admin");
const serviceAccount = require("./login-183-firebase-adminsdk-fbsvc-6ca3379310.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

async function verifyToken(idToken) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw error;
    }
}

async function getUser(uid) {
    try {
        const userRecord = await admin.auth().getUser(uid);
        return userRecord;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

module.exports = { verifyToken, getUser };