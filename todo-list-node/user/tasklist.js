const db = require('../fw/db');

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
        let conn = await db.connectDB();
        let [rows] = await conn.query('SELECT ID, title, state FROM tasks WHERE UserID = ?', [req.cookies.userid]);

        console.log("result: ", rows);

        if (Array.isArray(rows) && rows.length > 0) {
            rows.forEach(function (row) {
                html += `
                    <tr>
                        <td>${sanitize(row.ID)}</td>
                        <td class="wide">${sanitize(row.title)}</td>
                        <td>${sanitize(ucfirst(row.state))}</td>
                        <td>
                            <a href="edit?id=${sanitize(row.ID)}">edit</a> | <a href="delete?id=${sanitize(row.ID)}">delete</a>
                        </td>
                    </tr>`;
            });
        } else {
            html += `<tr><td colspan="4">No tasks found</td></tr>`;
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
}