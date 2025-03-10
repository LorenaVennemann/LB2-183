const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

async function getHtml(req) {
    let html = `
    <section id="list">
        <a href="edit">Create Task</a>
        <table>
            <tr>
                <th>ID</th>
                <th>Description</th>
                <th>State</th>
                <th></th>
            </tr>
    `;
    try {
        const tasksSnapshot = await db.collection('tasks').where('userId', '==', req.user.uid).get();
        if (tasksSnapshot.empty) {
            html += `<tr><td colspan="4">No tasks found</td></tr>`;
        } else {
            tasksSnapshot.forEach(doc => {
                const task = doc.data();
                html += `
                    <tr>
                        <td>${sanitize(doc.id)}</td>
                        <td class="wide">${sanitize(task.title)}</td>
                        <td>${sanitize(ucfirst(task.state))}</td>
                        <td>
                            <a href="edit?id=${sanitize(doc.id)}">edit</a> | <a href="delete?id=${sanitize(doc.id)}">delete</a>
                        </td>
                    </tr>`;
            });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        html += `<tr><td colspan="4">Error loading tasks</td></tr>`;
    }

    html += `
        </table>
    </section>`;
    return html;
}

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function sanitize(input) {
    if (input === null || input === undefined) return '';
    return input.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

module.exports = {
    html: getHtml
};