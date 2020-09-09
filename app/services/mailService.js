const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

function generateMailTransporter() {
    const oauth2Client = new OAuth2(
        process.env.MAIL_SERVICE_CLIENT_ID,
        process.env.MAIL_SERVICE_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.MAIL_SERVICE_REFRESH_TOKEN,
        access_token: process.env.MAIL_SERVICE_ACCESS_TOKEN
    });

    const accessToken = oauth2Client.getAccessToken().token;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "daniL@fluidweb.io", //your gmail account you used to set the project up in google cloud console"
            clientId: process.env.MAIL_SERVICE_CLIENT_ID,
            clientSecret: process.env.MAIL_SERVICE_CLIENT_SECRET,
            refreshToken: process.env.MAIL_SERVICE_REFRESH_TOKEN,
            accessToken: accessToken, //access token variable we defined earlier
        }
    });

    return transporter;
}

module.exports = {
    generateMailTransporter
}