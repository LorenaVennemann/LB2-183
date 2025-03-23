const express = require('express');
const { getFirestore } = require('firebase-admin/firestore');
const router = express.Router();

const db = getFirestore();

router.post('/', async (req, res) => {
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

        res.redirect('/');
    } else {
        res.send("<span class='info info-error'>No update was made</span>");
    }
});

module.exports = router;