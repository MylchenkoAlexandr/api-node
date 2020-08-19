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
        html: `<h1>Welcome to Blueberry</h1>`
    };

    try {
        await transporter.verify();

        const mail = await transporter.sendMail(mailOptions);

        if (mail) {
            res.send(200, { message: "Mail send" });
        } else res.send(400, { message: "Error" });

    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    sendMailToClient
};