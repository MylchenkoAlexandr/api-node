const MessageService = require("./message.service");

class MessageController {
    async saveAndSendMessage(req, res) {
        try {
            if ("lead_id" in req.body && "from" in req.body && "to" in req.body && "user_id" in req.body && "text" in req.body) {
                const data = req.body;

                const sendStatus = MessageService.sendMessage(data.from, data.to, data.text);

                let response = MessageService.create(data.lead_id, data.user_id, data.sendStatus, 0, data.text);

                if (!sendStatus) {
                    response = {
                        code: 400,
                        status: "error",
                        message: "Something went wrong please retry!"
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
}

module.exports = new MessageController();