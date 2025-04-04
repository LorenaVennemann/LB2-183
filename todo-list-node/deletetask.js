const express = require('express');
const { getFirestore } = require('firebase-admin/firestore');
const router = express.Router();

const db = getFirestore();

router.get('/', async (req, res) => {
    if (req.query.id !== undefined && req.query.id.length !== 0) {
        let taskId = req.query.id;
        try {
            const taskDocRef = db.collection('tasks').doc(taskId);
            const taskDoc = await taskDocRef.get();
            if (taskDoc.exists && taskDoc.data().userId === req.user.uid) {
                await taskDocRef.delete();
                res.redirect('/');
            } else {
                res.send("<span class='info info-error'>Unauthorized to delete this task</span>");
            }
        } catch (error) {
            console.error('Error deleting task');
            res.send("<span class='info info-error'>Error deleting task</span>");
        }
    } else {
        res.send("<span class='info info-error'>No task ID provided</span>");
    }
});

module.exports = router;