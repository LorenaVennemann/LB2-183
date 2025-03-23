const express = require('express');
const { getFirestore } = require('firebase-admin/firestore');
const escapeHtml = require('escape-html');

const db = getFirestore();
const router = express.Router();

router.get('/', async (req, res) => {
    let title = '';
    let state = '';
    let taskId = '';
    let options = ["Open", "In Progress", "Done"];

    if (req.query.id !== undefined) {
        taskId = req.query.id;
        const taskDocRef = db.collection('tasks').doc(taskId);
        const taskDoc = await taskDocRef.get();
        if (taskDoc.exists) {
            const taskData = taskDoc.data();
            title = taskData.title;
            state = taskData.state;
        }
    }

    res.render('edit', { 
        user: req.user,
        userData: req.userData,
        taskId: taskId,
        title: title,
        state: state,
        options: options
    });
});

module.exports = router;