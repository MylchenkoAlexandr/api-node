const db = require('../../database/models');

const NotesRepository = {
    async getAll(lead_id) {
        try {
            const notes = await db.sequelize.query(`SELECT notes.id, users.fname, users.lname, notes.message, notes.createdAt, notes.updatedAt FROM notes INNER JOIN users ON notes.user_id = users.id WHERE notes.lead_id = ${lead_id}`, {
                type: db.sequelize.QueryTypes.SELECT,
            })

            return notes;
        } catch (error) {
            throw error;
        }
    },
    async getOne(note_id) {
        try {
            const note = await db.sequelize.query(`SELECT notes.id, users.fname, users.lname, notes.message, notes.createdAt, notes.updatedAt FROM notes INNER JOIN users ON notes.user_id = users.id WHERE notes.id = ${note_id}`, {
                type: db.sequelize.QueryTypes.SELECT,
            })

            return note[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = NotesRepository