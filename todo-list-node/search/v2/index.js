const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

async function search(req) {
    if (req.query.userid === undefined || req.query.terms === undefined) {
        return "Not enough information to search";
    }

    let userid = req.query.userid;
    let terms = req.query.terms.toLowerCase(); // Konvertiere die Suchbegriffe in Kleinbuchstaben
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
        console.error('Error executing query:', error);
        result = 'Error executing query';
    }

    return result;
}

module.exports = {
    search: search
};