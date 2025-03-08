const mysql = require('mysql2/promise');
const dbConfig = require('../config');

// Verbindung zur Datenbank herstellen
async function connectDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Database connected');
        return connection;
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
}

// Ausführung eines vorbereiteten Statements
async function executeStatement(statement, params) {
    let conn;
    try {
        conn = await connectDB();
        const [results, fields] = await conn.execute(statement, params);
        return results;
    } catch (error) {
        console.error('Error executing statement:', error);
        throw error;
    } finally {
        if (conn) {
            await conn.end();
        }
    }
}

module.exports = { connectDB: connectDB, executeStatement: executeStatement };