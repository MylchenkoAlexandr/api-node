const NotesService = require('../services/notes.service');

class NotesFacade {
    async getNotes(lead_id) {
        try {
            const notes = await NotesService.getAll(lead_id);

            return { code: 200, status: 'success', message: 'All notes', notes };
        } catch (err) {
            throw err;
        }
    }

    async createNote(note_options) {
        try {
            const { id: note_id } = await NotesService.create(note_options);
            const note = await NotesService.getOne(note_id);

            return { code: 201, status: 'success', message: 'Note created!', note };
        } catch (err) {
            throw err;
        }
    }

    async deleteNote(note_id) {
        try {
            await NotesService.delete(note_id);

            return { code: 200, status: 'success', message: 'Note deleted!' };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new NotesFacade;