const MailService = require('../services/mail.service');
const LeadService = require('../services/lead.service');

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

async function sendEmailWithCompanies(req, res) {

    try {
        if (
            ("companies" in req.body)
            && ("email" in req.body)
            && ("coverage_amount" in req.body)
            && ("term") in req.body
        ) {
            const email_params = req.body;
            const email_sended = await LeadService.checkLeadAtSendedEmail(email_params.email);

            if (typeof email_params.companies == 'string') {
                email_params.companies = JSON.parse(email_params.companies);
            }

            if (!email_sended) {
                const html = MailService.generateQuotesHtmlTemplate('quote.ejs', email_params);

                const mail_options = {
                    from: process.env.MAIL_SERVICE_USER_EMAIL,
                    to: email_params.email,
                    subject: "Blueberry Insurance",
                    html
                };

                await MailService.send(mail_options);
                await LeadService.updateLeadAtSendedEmail(email_params.email, true);

                return res.status(200).json({ status: 'success', message: 'Email send' });
            } else {
                return res.status(200).json({ status: 'success', message: "Email don't send" });
            }
        }

        return res.status(400).json({ status: 'error', message: 'Bad request' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw err;
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
    sendEmailWithCompanies
};