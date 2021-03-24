const models = require('../../database/models');
const NotesRepository = require('../repository/notes.repository');

class NotesService {
    /**
     * The function for get all notes for lead by lead_id
     * @param {number} lead_id 
     */
    async getAll(lead_id) {
        try {
            const notes = await NotesRepository.getAll(lead_id);
            return notes;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for get one notes for lead by note_id
     * @param {number} note_id 
     */
    async getOne(note_id) {
        try {
            const note = await NotesRepository.getOne(note_id);
            return note;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for create note for lead
     * @param {number} user_id 
     * @param {number} lead_id 
     * @param {string} message 
     */
    async create({ user_id, lead_id, message }) {
        try {
            const create_note = await models.Notes.create({
                user_id,
                lead_id,
                message
            });

            return create_note;
        } catch (error) {
            throw error;
        }

    }

    /**
     * The function for delete note by note_id
     * @param {number} note_id
     */
    async delete(note_id) {
        try {
            await models.Notes.destroy({
                where: {
                    id: note_id
                }
            });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new NotesService;