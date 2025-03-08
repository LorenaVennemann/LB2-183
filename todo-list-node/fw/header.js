const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../login-183-firebase-adminsdk-fbsvc-6ca3379310.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = getFirestore();

async function getHtml(req) {
    let content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TBZ 'Secure' App</title>
    <link rel="stylesheet" href="/style.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.1/jquery.validate.min.js"></script>
</head>
<body>
    <header>
        <div>This is the insecure m183 test app</div>`;

    if (req.user && req.user.uid) {
        const userDocRef = db.collection('users').doc(req.user.uid); const userDoc = await userDocRef.get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log("userData: " + JSON.stringify(userData));
            const isAdmin = userData.isAdmin;
            console.log("isAdmin: " + isAdmin);

            content += `
            <nav>
                <ul>
                    <li><a href="/">Tasks</a></li>`;
            if (isAdmin) {
                content += `
                    <li><a href="/admin/users">User List</a></li>`;
            }
            content += `
                    <li><a href="/logout">Logout</a></li>
                </ul>
            </nav>`;
        }
    }

    content += `
    </header>
    <main>`;

    return content;
}

module.exports = getHtml;