const models = require('../../database/models');
const NotesRepository = require('../repository/NotesRepository');

async function getNotes(req, res) {
    try {
        const notes = await NotesRepository.getAll(req.body.lead_id);

        if (notes) {
            return res.status(200).json(notes);
        }
    } catch (e) {
        console.error(e)
    }

    return res.status(400).json({ message: 'Server Error!' });
}

async function createNote(req, res) {

    try {
        const createNote = await models.Notes.create({
            user_id: req.body.user_id,
            lead_id: req.body.lead_id,
            message: req.body.message,
        });

        if (createNote) {
            const note = await NotesRepository.getOne(createNote.id);
            return res.status(200).json(note);
        }
    } catch (e) {
        console.error(e)
    }

    return res.status(400).json({ message: 'Server Error!' });
}

async function deleteNote(req, res) {
    try {
        await models.Notes.destroy({
            where: {
                id: req.body.note_id
            }
        });

        return res.status(200).json({ deleted: true });
    } catch (e) {
        console.error(e)
    }

    return res.status(400).json({ message: "Server Error!" });
}

module.exports = {
    getNotes,
    createNote,
    deleteNote
}   