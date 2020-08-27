const models = require('../../database/models')

async function get(req, res) {
    try {
        const notes = await models.Notes.findAll({
            where: {
                lead_id: req.body.lead_id
            }
        });
        
        console.log("get -> notes", notes)

        if (notes) {
            res.status(200).json(notes);
        }
    } catch (e) {
        console.error(e)
    }

}

async function create(req, res) {
    const note = req.body;

    try {
        const notes = await models.Notes.create({
            user_id: note.user_id,
            lead_id: note.lead_id,
            message: note.message,
        });

        return res.send(200).json(notes);
    } catch (error) {
        console.log(error)
    }

    return res.status(200).send(note);
}

async function deleteNote(req, res) {
    try {
        de
    } catch (e) {

    }
}

module.exports = {
    get,
    create
}   