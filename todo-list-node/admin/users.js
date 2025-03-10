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
        const userId = doc.id;
        
        const email = user.email ? user.email : 'No email';
        const isAdmin = user.isAdmin !== undefined ? user.isAdmin : false;
        
        html += `<tr><td>${sanitize(userId)}</td><td>${sanitize(email)}</td><td>${sanitize(isAdmin ? 'Admin' : 'User')}</td></tr>`;
    });
    
    html += `</table>`;
    return html;
}

function sanitize(input) {
    if (input === null || input === undefined) return '';
    return input.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

module.exports = { html: getHtml() };