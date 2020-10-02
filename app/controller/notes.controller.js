const NotesService = require('../services/notes.service');

async function getNotes(req, res) {
    try {
        const notes = await NotesService.getAll(req.params.lead_id);

        return res.status(200).json({ status: 'success', message: 'All notes', notes });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server Error!' });
        throw err;
    }
}

async function createNote(req, res) {
    const note_param = {
        user_id: req.body.user_id,
        lead_id: req.body.lead_id,
        message: req.body.message
    }

    try {
        if (note_param.user_id && note_param.lead_id && note_param.message && note_param.message != '') {
            const note = await NotesService.create(note_param);

            return res.status(201).json({ status: 'success', message: 'Note created!', note });
        }

        return res.status(400).json({ status: 'error' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
        throw err;
    }
}

async function deleteNote(req, res) {
    try {
        const deleted = await NotesService.delete(req.params.note_id);

        return res.status(200).json({ status: 'success', message: 'Note deleted!', deleted });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
        throw err;
    }
}

module.exports = {
    getNotes,
    createNote,
    deleteNote
}   