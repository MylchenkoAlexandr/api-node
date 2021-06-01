const NotesFacade = require('../facades/notes.facade');

class NotesController {
    async getNotes(req, res) {
        try {
            const response = await NotesFacade.getNotes(req.params.lead_id);

            return res.status(response.code).json({ status: response.status, message: response.message, notes: response.notes });
        } catch (err) {
            res.status(500).json({ status: 'error', message: 'Server Error!' });
            throw err;
        }
    }

    async createNote(req, res) {
        try {
            if (("user_id" in req.body)
                && ("lead_id" in req.body)
                && ("message" in req.body)
                && req.body.message != ''
            ) {
                const note_options = {
                    user_id: req.body.user_id,
                    lead_id: req.body.lead_id,
                    message: req.body.message
                }
                const response = await NotesFacade.createNote(note_options);

                return res.status(response.code).json({ status: response.status, message: response.message, note: response.note });
            }

            return res.status(400).json({ status: 'error', message: 'Bad request' });
        } catch (err) {
            res.status(500).json({ status: 'error', message: 'Server Error' });
            throw err;
        }
    }

    async deleteNote(req, res) {
        try {
            const response = await NotesFacade.deleteNote(req.params.note_id);

            return res.status(response.code).json({ status: response.status, message: response.message });
        } catch (err) {
            res.status(500).json({ status: 'error', message: 'Server Error' });
            throw err;
        }
    }
}


module.exports = new NotesController;