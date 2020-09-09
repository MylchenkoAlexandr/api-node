const { generateMailTransporter } = require('../services/mailService');

async function sendMailToClient(req, res) {
    const transporter = generateMailTransporter();

    const mailOptions = {
        from: "danil@fluidweb.io",
        to: req.body.email,
        subject: "Blueberry",
        text: req.body.text
    };

    try {
        await transporter.verify();
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Mail send" });
    } catch (error) {
        console.error(error);
    }

    return res.status(400).json({ message: "Server error" });
}

module.exports = {
    sendMailToClient
};