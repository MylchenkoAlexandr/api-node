const models = require('../../database/models');
const NotesRepository = require('../repository/notes.repository');

class NotesService {
    async getAll(lead_id) {
        try {
            const notes = await NotesRepository.getAll(lead_id);
            return notes;
        } catch (error) {
            throw error;
        }
    }

    async create({ user_id, lead_id, message }) {
        try {
            const createNote = await models.Notes.create({
                user_id,
                lead_id,
                message
            });

            if (createNote) {
                const note = await NotesRepository.getOne(createNote.id);

                return note;
            }
        } catch (error) {
            throw error;
        }

    }

    async delete(note_id) {
        try {
            await models.Notes.destroy({
                where: {
                    id: note_id
                }
            });

            return true;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new NotesService;