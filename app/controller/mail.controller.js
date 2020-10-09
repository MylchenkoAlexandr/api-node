const MailService = require('../services/mail.service');

async function sendMailToClient(req, res) {
    try {
        const mail_options = {
            from: req.body.email_agent,
            to: req.body.email,
            subject: "Blueberry Insurance",
            text: req.body.text
        };

        await MailService.send(mail_options);

        return res.status(200).json({ status: "success", message: "Mail send" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

function generateAuthUrl(req, res) {
    const url = MailService.generateAuthUrl();
    res.status(201).json({ status: "success", message: "Url generate", url });
}

async function createToken(req, res) {
    try {
        const tokens = await MailService.createToken();
        res.status(201).json({ status: 'success', message: "Token created", tokens });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

module.exports = {
    sendMailToClient,
    createToken,
};