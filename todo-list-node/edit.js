const { getFirestore } = require('firebase-admin/firestore');
const escapeHtml = require('escape-html');

const db = getFirestore();

async function getHtml(req) {
    let title = '';
    let state = '';
    let taskId = '';
    let html = '';
    let options = ["Open", "In Progress", "Done"];

    if (req.query.id !== undefined) {
        console.log('req.query: ')
        console.log(req.query);
        console.log(req.query.id);
        taskId = req.query.id;
        const taskDocRef = db.collection('tasks').doc(taskId);
        const taskDoc = await taskDocRef.get();
        if (taskDoc.exists) {
            const taskData = taskDoc.data();
            title = taskData.title;
            state = taskData.state;
        }

        html += `<h1>Edit Task</h1>`;
    } else {
        html += `<h1>Create Task</h1>`;
    }

    html += `
    <form id="form" method="post" action="savetask">
        <input type="hidden" name="id" value="` + escapeHtml(taskId) + `" />
        <div class="form-group">
            <label for="title">Description</label>
            <input type="text" class="form-control size-medium" name="title" id="title" value="` + escapeHtml(title) + `">
        </div>
        <div class="form-group">
            <label for="state">State</label>
            <select name="state" id="state" class="size-auto">`;

    for (let i = 0; i < options.length; i++) {
        let selected = state.toLowerCase() === options[i].toLowerCase() ? 'selected' : '';
        html += `<option value='` + escapeHtml(options[i].toLowerCase()) + `' ` + selected + `>` + escapeHtml(options[i]) + `</option>`;
    }

    html += `
            </select>
        </div>
        <div class="form-group">
            <label for="submit" ></label>
            <input id="submit" type="submit" class="btn size-auto" value="Submit" />
        </div>
    </form>
    <script>
        $(document).ready(function () {
        $('#form').validate({
            rules: {
                title: {
                    required: true
                }
            },
            messages: {
                title: 'Please enter a description.',
            },
            submitHandler: function (form) {
                form.submit();
            }
        });
    });
    </script>`;

    return html;
}

module.exports = { html: getHtml }