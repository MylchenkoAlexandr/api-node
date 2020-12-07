const db = require('../../database/models');

class ConferenceRespository {
    async getLeadIdFromCall(field, id) {
        try {
            const lead = await db.sequelize.query(`SELECT conferences.lead_id FROM conferences WHERE conferences.${field} = "${id}" ORDER BY conferences.createdAt DESC LIMIT 1`, {
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });
            
            return lead.lead_id;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new ConferenceRespository;