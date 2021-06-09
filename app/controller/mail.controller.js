const models = require('../../database/models');
const MailService = require('../services/mail.service');

class MailController {
    async sendMailToClient(req, res) {
        try {
            if (("emailClient" in req.body) && ("fullnameClient" in req.body) && ("text" in req.body) && req.body.text.trim() != '') {
                const user = await models.Users.findByPk(req.params.user_id);

                let title = `To: ${req.body.fullnameClient}, From: ❤️ @ Blueberry`;

                if ("title" in req.body && req.body.title !== "") {
                    title = req.body.title;
                }

                const email_options = {
                    from: `${user.fname} ${user.lname} <${user.email}>`,
                    to: req.body.emailClient,
                    subject: title,
                    text: req.body.text,
                };

                const email_params = {
                    lead_id: req.params.lead_id,
                    user_id: req.params.user_id,
                    text: req.body.text
                }

                const email = await MailService.sendFromAgent(email_options, email_params, user);
                return res.status(200).json({ status: "success", message: "Mail send", email });
            }

            return res.status(400).json({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async getAllMailsByLead(req, res) {
        try {
            const emails = await MailService.getAll(req.params.lead_id);
            return res.status(200).json({ status: "success", emails });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async getMails(req, res) {
        try {

        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    getAuthCode(req, res) {
        try {
            if ("clientId" in req.body && "clientSecret" in req.body) {
                const link = MailService.generateAuthUrl(req.body.clientId, req.body.clientSecret);
                res.status(201).json({ status: "success", message: "Url generate", link: link });
            }

            return res.status(400).json({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async createToken(req, res) {
        try {
            if ("authCode" in req.body && "clientId" in req.body && "clientSecret" in req.body) {
                const tokens = await MailService.createToken(
                    req.body.authCode,
                    req.body.clientId,
                    req.body.clientSecret,
                );
                res.status(201).json({ status: 'success', message: "Token created", tokens });
            }

            return res.status(400).json({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }
}


module.exports = new MailController;