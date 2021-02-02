const db = require('../../database/models');

class SmsRepository {
    async getOneById(id) {
        const message = await db.sequelize.query(
            "SELECT sms.*, leads.fullname as lead_name, leads.phone as `to` FROM sms LEFT JOIN users ON users.id = sms.user_id LEFT JOIN leads ON leads.id = sms.lead_id WHERE sms.id = " + id, {
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
            "SELECT sms.id, sms.is_client_message, sms.send_status, sms.read_status, sms.createdAt, sms.text, leads.fullname as customer_fullname, leads.phone as customer_phone, CONCAT(users.fname, ' ', users.lname) as agent_fullname FROM sms LEFT JOIN users ON users.id = sms.user_id LEFT JOIN leads ON leads.id = sms.lead_id WHERE sms.lead_id = " + lead_id, {
            type: db.sequelize.QueryTypes.SELECT
        });

        return messages;
    }

    async getUnreadMessages(user_id) {
        let sql = "SELECT sms.*, leads.fullname as lead_name FROM sms LEFT JOIN leads ON sms.lead_id = leads.id WHERE sms.read_status = 0 AND sms.is_client_message = 1";

        if (parseInt(user_id) !== 1) sql += " AND sms.user_id = " + user_id;

        const messages = await db.sequelize.query(
            sql, {
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        return messages;
    }

    async getUnreadMessagesByLeadId(user_id, lead_id) {
        let sql = "SELECT sms.*, leads.fullname as lead_name FROM sms LEFT JOIN leads ON sms.lead_id = leads.id WHERE sms.read_status = 0 AND sms.is_client_message = 1 AND sms.lead_id = " + lead_id;

        if (parseInt(user_id) !== 1) sql += " AND sms.user_id = " + user_id;

        const messages = await db.sequelize.query(
            sql, {
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        return messages;
    }

    async updateReadStatus(message_id) {
        const result = await db.sequelize.query(
            "UPDATE sms SET read_status = 1 WHERE id = " + message_id, {
                type: db.sequelize.QueryTypes.UPDATE
            }
        );

        return result;
    }
}

module.exports = new SmsRepository;

