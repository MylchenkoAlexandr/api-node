const db = require('../../database/models');

class CustomersVMRepository {
    async getOneById(id) {
        const voiceMail = await db.sequelize.query(
            'SELECT cvm.id, cvm.lead_id, cvm.url, cvm.createdAt FROM customers_voice_mails cvm WHERE cvm.id = :id'
            , {
                replacements: { id: id },
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });

        return voiceMail;
    }
    async getAllByLeadId(lead_id) {
        const voiceMail = await db.sequelize.query(
            'SELECT cvm.id, cvm.lead_id, cvm.url, cvm.createdAt FROM customers_voice_mails cvm WHERE cvm.lead_id = :lead_id'
            , {
                replacements: { lead_id: lead_id },
                type: db.sequelize.QueryTypes.SELECT,
                // plain: true
            });

        return voiceMail;
    }
}

module.exports = new CustomersVMRepository;