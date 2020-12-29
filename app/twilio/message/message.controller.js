const MessageService = require("./message.service");
const TrasformationHelper = require('../../helpers/transformation.helper');
const SmsRepository = require('../../repository/sms.repository');

class MessageController {
    async allByLeadId(req, res) {
        try {
            if ("lead_id" in req.params) {
                const messages = SmsRepository.getAllByLeadId(req.params.lead_id);
                if (messages) {
                    return res.status(200).json(messages);
                }
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw err;
        }
    }

    async saveAndSendMessage(req, res) {
        try {
            if ("lead_id" in req.body && "from" in req.body && "to" in req.body && "user_id" in req.body && "text" in req.body && "to" in req.body && "from" in req.body) {
                const data = req.body;

                data.from = TrasformationHelper.formatPhoneForCall(data.from);
                data.to = TrasformationHelper.formatPhoneForCall(data.to);

                const sendStatus = MessageService.sendMessage(data.from, data.to, data.text);

                let response = MessageService.create(data.lead_id, data.user_id, data.sendStatus, 0, data.text);

                if (!sendStatus) {
                    response = {
                        code: 400,
                        status: "error",
                        message: "Message doesn`t sent, please retry!"
                    };
                }

                return res.status(response.code).json({ status: response.status, message: response.message });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw err;
        }
    }

    async resendMessage(req, res) {
        try {
            if("id" in req.body){
                
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw err;
        }
    }
}

module.exports = new MessageController();