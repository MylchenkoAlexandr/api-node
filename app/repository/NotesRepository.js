const db = require('../../database/models');

const NotesRepository = {
    getAll(lead_id) {
        return new Promise(async (resolve, reject) => {
            const notes = await db.sequelize.query(`SELECT notes.id, users.fname, users.lname, notes.message, notes.createdAt, notes.updatedAt FROM notes INNER JOIN users ON notes.user_id = users.id WHERE notes.lead_id = ${lead_id}`, {
                type: db.sequelize.QueryTypes.SELECT,
            }).catch(e => {
                console.error(e);
            });

            if (notes) {
                return resolve(notes);
            }
        });
    },
    getOne(note_id) {
        return new Promise(async (resolve, reject) => {
            const note = await db.sequelize.query(`SELECT notes.id, users.fname, users.lname, notes.message, notes.createdAt, notes.updatedAt FROM notes INNER JOIN users ON notes.user_id = users.id WHERE notes.id = ${note_id}`, {
                type: db.sequelize.QueryTypes.SELECT,
            }).catch(e => {
                console.error(e);
            });

            if (note) {
                return resolve(note[0]);
            }
        });
    }
}

module.exports = NotesRepository