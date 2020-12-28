class MessageController {
    async sendSms(req, res) {
        try {
            if ("lead_id" in req.body && "user_id" in req.body && "text" in req.body) {
                
                
                return res.status(400).json({ status: 'success', message: 'Message sent' });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw err;
        }
    }
}

module.exports = new MessageController();