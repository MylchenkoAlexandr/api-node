const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

require('dotenv').config();

class MailService {
    constructor() {
        // Generate a url that asks permissions for Gmail scopes
        this.oauth2Client = new OAuth2(
            process.env.MAIL_SERVICE_CLIENT_ID,
            process.env.MAIL_SERVICE_CLIENT_SECRET,
            process.env.MAIL_SERVICE_REDIRECT_URI
        );
    }

    async generateMailTransporter() {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: "OAuth2",
                    user: process.env.MAIL_SERVICE_USER_EMAIL, //your gmail account you used to set the project up in google cloud console"
                    clientId: process.env.MAIL_SERVICE_CLIENT_ID,
                    clientSecret: process.env.MAIL_SERVICE_CLIENT_SECRET,
                    refreshToken: process.env.MAIL_SERVICE_REFRESH_TOKEN,
                    accessToken: process.env.MAIL_SERVICE_ACCESS_TOKEN, //access token variable we defined earlier
                    expires: process.env.MAIL_SERVICE_EXPIRY_DATE
                }
            });

            return transporter;
        } catch (error) {
            throw error;
        }
    }

    generateAuthUrl() {
        const GMAIL_SCOPES = [
            'https://mail.google.com/',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.compose',
            'https://www.googleapis.com/auth/gmail.send',
        ];

        const auth_url = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: GMAIL_SCOPES,
        });
        console.log(auth_url);
    }

    async createToken() {
        try {
            const { tokens } = await this.oauth2Client.getToken(process.env.MAIL_SERVICE_AUTH_CODE);
            return tokens;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MailService;