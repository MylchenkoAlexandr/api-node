const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const models = require("../../../database/models");
class MessageService {
    async create(lead_id, user_id, send_status, is_client_message, text) {
        const message = await models.Sms.create({
            lead_id: lead_id,
            user_id: user_id,
            send_status: send_status,
            is_client_message: is_client_message,
            text: text
        });

        return message;
    }

    sendMessage(from, to, text) {
        return new Promise((resolve, reject) => {
            client.messages
                .create({
                    body: text,
                    from: from,
                    to: to
                })
                .then(() => {
                    resolve(true);
                })
                .catch((e) => {
                    console.log(e);
                    reject(false);
                });
        });
    }

    async setSendStatus(id, status){
        try {
            await models.Sms.update({
                send_status: status
            },{
                where: {
                    id: id
                }
            });
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MessageService;