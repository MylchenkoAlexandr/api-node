const nodemailer = require('nodemailer');

async function sendMailToClient(req, res) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "danilkrivosheynodejs@gmail.com",
            pass: "a19771606z",
        }
    });

    const mailOptions = {
        from: "danilkrivosheynodejs@gmail.com",
        to: req.body.email,
        subject: "Blueberry",
        html: `<h1></h1>`
    };

    try {
        await transporter.verify();

        const mail = await transporter.sendMail(mailOptions);

        if (mail) {
            return res.status(200).json({ message: "Mail send" });
        }

    } catch (error) {
        console.error(error);
    }

    return res.status(400).json({ message: "Error" });
}

module.exports = {
    sendMailToClient
};