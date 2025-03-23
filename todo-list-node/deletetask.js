const express = require('express');
const { getFirestore } = require('firebase-admin/firestore');
const router = express.Router();

const db = getFirestore();

router.get('/', async (req, res) => {
    if (req.query.id !== undefined && req.query.id.length !== 0) {
        let taskId = req.query.id;
        try {
            await db.collection('tasks').doc(taskId).delete();
            res.redirect('/'); // Redirect to the task list after deletion
        } catch (error) {
            console.error('Error deleting task');
            res.send("<span class='info info-error'>Error deleting task</span>");
        }
    } else {
        res.send("<span class='info info-error'>No task ID provided</span>");
    }
});

module.exports = router;