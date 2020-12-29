const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const models = require("../../../database/models");
class MessageService {
    async create(lead_id, user_id, send_status, is_client_message, text) {
        await models.Sms.create({
            lead_id: lead_id,
            user_id: user_id,
            send_status: send_status,
            is_client_message: is_client_message,
            text: text
        }).then(() => {
            return {
                code: 200,
                status: "success",
                message: "Message sent success!"
            };
        }).catch(() => {
            return {
                code: 400,
                status: "error",
                message: "Something went wrong please retry!"
            };
        });
    }

    sendMessage(from, to, text) {
        client.messages
            .create({
                body: text,
                from: from,
                to: to
            })
            .then(() => { return true; })
            .catch((e) => {
                console.log(e);
                return false;
            });
    }
}

module.exports = new MessageService;