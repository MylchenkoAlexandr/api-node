const MailService = require('../services/mail.service');

async function sendMailToClient(req, res) {

    const mailOptions = {
        from: req.body.email_agent,
        to: req.body.email,
        subject: "Blueberry Insurance",
        text: req.body.text
    };

    try {
        const transporter = await MailService.generateMailTransporter();
        await transporter.verify();
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            status: "success",
            message: "Mail send"
        });

    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Mail don't send"
        });
        throw error;
    }
}

function generateAuthUrl(req, res) {
    const url = MailService.generateAuthUrl();
    res.status(201).json({ message: "Url generate", url });
}

async function createToken(req, res) {
    try {
        const tokens = await MailService.createToken();
        res.status(201).json({ message: "Token created", tokens });
    } catch (error) {
        res.status(400).json({ message: "Error" });
        throw error;
    }
}

module.exports = {
    sendMailToClient,
    createToken
};