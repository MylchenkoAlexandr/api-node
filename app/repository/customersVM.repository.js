const db = require('../../database/models');

class CustomersVMRepository {
    async getOneById(id) {
        const voiceMail = await db.sequelize.query(
            'SELECT cvm.id, cvm.lead_id, cvm.url, cvm.createdAt, leads.phone as lead_phone, leads.fullname as lead_name, leads.user_id, users.email as agent_email, users.fname as agent_name, users.phone as user_phone FROM customers_voice_mails cvm LEFT JOIN leads ON leads.id = cvm.lead_id LEFT JOIN users ON users.id = leads.user_id WHERE cvm.id = :id'
            , {
                replacements: { id: id },
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });

        return voiceMail;
    }
    async getAllByLeadId(lead_id) {
        const voiceMail = await db.sequelize.query(
            'SELECT cvm.id, cvm.lead_id, cvm.url, cvm.createdAt, cvm.listen_status FROM customers_voice_mails cvm WHERE cvm.lead_id = :lead_id'
            , {
                replacements: { lead_id: lead_id },
                type: db.sequelize.QueryTypes.SELECT,
                // plain: true
            });

        return voiceMail;
    }
    async getNotListenedCustomerVM(user_id) {
        try {
            let sql = 'SELECT cvm.id, cvm.url, cvm.lead_id, cvm.createdAt as createdAt, leads.fullname as lead_name, leads.user_id FROM customers_voice_mails as cvm LEFT JOIN leads ON leads.id = cvm.lead_id WHERE listen_status = 0';

            if (parseInt(user_id) !== 1) sql += ' AND leads.user_id = ' + user_id;

            let data = await db.sequelize.query(sql, {
                type: db.sequelize.QueryTypes.SELECT,
            });

            return data;
        } catch (error) {
            throw error;
        }
    }
    async getNotListenedCustomerVMByLead(user_id, lead_id) {
        try {
            let sql = 'SELECT cvm.id, cvm.url, cvm.lead_id, cvm.createdAt as createdAt, leads.fullname as lead_name, leads.user_id FROM customers_voice_mails as cvm LEFT JOIN leads ON leads.id = cvm.lead_id WHERE listen_status = 0 AND lead_id = ' + lead_id;

            if (parseInt(user_id) !== 1) sql += ' AND leads.user_id = ' + user_id;

            let data = await db.sequelize.query(sql, {
                type: db.sequelize.QueryTypes.SELECT,
            });

            return data;
        } catch (error) {
            throw error;
        }
    }
    async updateListenStatus(voicemail_id) {
        const result = await db.sequelize.query(
            "UPDATE customers_voice_mails SET listen_status = 1 WHERE id = " + voicemail_id, {
                type: db.sequelize.QueryTypes.UPDATE
            }
        );

        return result;
    }
}

module.exports = new CustomersVMRepository;