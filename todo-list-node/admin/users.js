const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

async function getHtml() {
    let html = '';
    let usersSnapshot = await db.collection('users').get();

    html += `
    <h2>User List</h2>

    <table>
        <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
        </tr>`;

    usersSnapshot.forEach(doc => {
        const user = doc.data();
        html += `<tr><td>${sanitize(doc.id)}</td><td>${sanitize(user.email)}</td><td>${sanitize(user.isAdmin ? 'Admin' : 'User')}</td></tr>`;
    });

    html += `
    </table>`;

    return html;
}

function sanitize(input) {
    return input.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

module.exports = { html: getHtml() };