const db = require('../config/db');

class Item {
    static create({ name, imageUrl, patientId}, callback) {
        db.run(
            `INSERT INTO items (name, imageUrl, patient_id)
            VALUES (?, ?, ?)`,
            [name, imageUrl, patientId],
            function(err) {
                callback(err, { id: this.lastID, name, imageUrl, patientId});
            }
        );
    }
    
    static findByPatient(patientId, callback) {
        db.all(
            `SELECT * FROM items
            WHERE patient_id = ?
            ORDER BY create_at DESC`,
            [patientId],
            callback
        );
    }

    static delete(id, callback) {
        db.all(
            `SELECT * FROM items
            WHRE patient_id = ?
            ORDER BY create_at DESC`,
            [patientId, `${query}%`],
            callback
        )
    }

    static delete(id, callback) {
        db.run(`DELETE FROM items WHERE id = ?`, [id], callback);
    }
}

module.exports = Item;