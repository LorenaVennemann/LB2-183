const express = require('express');
const router = express.Router();
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

router.post('/', async (req, res) => {
    if (!req.body.userid || !req.body.terms) {
        return res.status(400).send("Not enough information to search");
    }

    let userid = req.body.userid;
    let terms = req.body.terms.toLowerCase(); // Konvertiere die Suchbegriffe in Kleinbuchstaben
    let result = '';

    try {
        const tasksSnapshot = await db.collection('tasks')
            .where('userId', '==', userid)
            .get();

        if (tasksSnapshot.empty) {
            result = 'No results found!';
        } else {
            tasksSnapshot.forEach(doc => {
                const task = doc.data();
                if (task.title.toLowerCase().includes(terms)) { // Überprüfe, ob der Titel die Suchbegriffe enthält
                    result += `${task.title} (${task.state})<br />`;
                }
            });
        }
    } catch (error) {
        console.error('Fehler beim Suchen');
        result = 'Error executing query';
    }

    res.send(result);
});

module.exports = router;