const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

async function getHtml(req) {
    let html = '';
    let taskId = '';

    if (req.body.id !== undefined && req.body.id.length !== 0) {
        taskId = req.body.id;
        const taskDocRef = db.collection('tasks').doc(taskId);
        const taskDoc = await taskDocRef.get();
        if (!taskDoc.exists) {
            taskId = '';
        }
    }

    if (req.body.title !== undefined && req.body.state !== undefined) {
        const state = req.body.state;
        const title = req.body.title;
        const userId = req.user.uid;

        if (taskId === '') {
            const newTaskRef = db.collection('tasks').doc();
            await newTaskRef.set({
                userId: userId,
                title: title,
                state: state
            });
        } else {
            const taskDocRef = db.collection('tasks').doc(taskId);
            await taskDocRef.update({
                title: title,
                state: state
            });
        }

        html += "<span class='info info-success'>Update successful</span>";
    } else {
        html += "<span class='info info-error'>No update was made</span>";
    }

    return html;
}

module.exports = { html: getHtml };