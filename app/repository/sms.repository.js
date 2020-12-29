const messageService = require("../twilio/message/message.service");

class SmsRrepository {
    async getAllByLeadId(lead_id) {
        const messages = await db.sequelize.query(
            "SELECT sms.text, leads.fullname as customer_fullname, leads.phone as customer_phone, CONCAT(users.fname, ' ', users.lname) as agent_fullname users.twilio_phone as agent_phone INNER JOIN users ON users.id = sms.user_id INNER JOIN leads ON leads.id = sms.lead_id FROM sms WHERE sms.lead_id = " + lead_id
            , {
                type: db.sequelize.QueryTypes.SELECT
            });
            
        return messages;
    }
}

module.exports = new SmsRrepository;