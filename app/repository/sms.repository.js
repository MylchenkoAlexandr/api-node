const db = require('../../database/models');

class SmsRrepository {
    async getOneById(id) {
        const message = await db.sequelize.query(
            "SELECT sms.*, leads.phone as `to` FROM sms LEFT JOIN users ON users.id = sms.user_id LEFT JOIN leads ON leads.id = sms.lead_id WHERE sms.id = " + id, {
            type: db.sequelize.QueryTypes.SELECT,
            plain: true
        });

        return message;
    }

    async getOneByIdWebsocket(id) {
        const message = await db.sequelize.query(
            "SELECT sms.id, sms.lead_id, sms.is_client_message, sms.send_status, sms.createdAt, sms.text, leads.fullname as customer_fullname, leads.phone as customer_phone, CONCAT(users.fname, ' ', users.lname) as agent_fullname FROM sms LEFT JOIN users ON users.id = sms.user_id LEFT JOIN leads ON leads.id = sms.lead_id WHERE sms.id = " + id, {
            type: db.sequelize.QueryTypes.SELECT,
            plain: true
        });

        return message;
    }

    async getAllByLeadId(lead_id) {
        const messages = await db.sequelize.query(
            "SELECT sms.id, sms.is_client_message, sms.send_status, sms.createdAt, sms.text, leads.fullname as customer_fullname, leads.phone as customer_phone, CONCAT(users.fname, ' ', users.lname) as agent_fullname FROM sms LEFT JOIN users ON users.id = sms.user_id LEFT JOIN leads ON leads.id = sms.lead_id WHERE sms.lead_id = " + lead_id, {
            type: db.sequelize.QueryTypes.SELECT
        });

        return messages;
    }
}

module.exports = new SmsRrepository;

