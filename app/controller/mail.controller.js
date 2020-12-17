const MailService = require('../services/mail.service');

async function sendMailToClient(req, res) {
    try {
        if (("emailClient" in req.body) && ("fullnameClient" in req.body) && ("text" in req.body) && req.body.text.trim() != '') {
            const email_options = {
                from: `Blueberry Insurance <${process.env.MAIL_SERVICE_USER_EMAIL}>`,
                to: req.body.emailClient,
                subject: `To: ${req.body.fullnameClient}, From: ❤️ @ Blueberry`,
                text: req.body.text
            };

            const email_params = {
                lead_id: req.params.lead_id,
                user_id: req.params.user_id,
                text: req.body.text
            }

            const email = await MailService.send(email_options, email_params);
            return res.status(200).json({ status: "success", message: "Mail send", email });
        }

        return res.status(400).json({ status: "error", message: "Bad request" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

async function getAllMailsByLead(req, res) {
    try {
        const emails = await MailService.getAll(req.params.lead_id);
        return res.status(200).json({ status: "success", emails });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

async function getMails(req, res) {
    try {

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
    getAllMailsByLead
};