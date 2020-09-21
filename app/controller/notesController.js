const NotesService = require('../services/notes.service');

async function getNotes(req, res) {
    try {
        const notes = await NotesService.getAll(req.body.lead_id);

        res.status(200).json({
            status: 'success',
            message: 'All notes',
            notes
        });
    } catch (e) {
        res.status(400).json({ status: 'error', message: 'Server Error!' });
        throw e;
    }
}

async function createNote(req, res) {
    const note_param = req.body;

    try {
        const note = await NotesService.create(note_param);

        res.status(201).json({ status: 'success', message: 'Note created!', note });
    } catch (e) {
        res.status(400).json({ status: 'error', message: 'Server Error!' });
        throw e;
    }
}

async function deleteNote(req, res) {
    try {
        const deleted = await NotesService.delete(req.body.note_id);

        res.status(200).json({ status: 'success', message: 'Note deleted!', deleted });
    } catch (e) {
        res.status(400).json({ status: 'error', message: 'Server Error!' });
        throw e;``
    }

}

module.exports = {
    getNotes,
    createNote,
    deleteNote
}   