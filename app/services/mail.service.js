const nodemailer = require('nodemailer');
const ejs = require('ejs');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

require('dotenv').config();

class MailService {
    constructor() {
        this.emails_path = __dirname + '/../../emails/';
        // Generate a url that asks permissions for Gmail scopes
        this.oauth2Client = new OAuth2(
            process.env.MAIL_SERVICE_CLIENT_ID,
            process.env.MAIL_SERVICE_CLIENT_SECRET,
            process.env.MAIL_SERVICE_REDIRECT_URI
        );

        this.transporter = nodemailer.createTransport({
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
    }

    /**
     * The function for send email for client
     * @param {object} mail_options
     */
    async send(mail_options) {
        try {
            await this.transporter.verify();
            await this.transporter.sendMail(mail_options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for create accessToken on 2000 years
     */
    async createToken() {
        try {
            const { tokens } = await this.oauth2Client.getToken(process.env.MAIL_SERVICE_AUTH_CODE);
            return tokens;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for generate url which get authorization code for need to be create access token
     */
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

    /**
     * The function for generate html email template by ejs engine
     * @param {string} filename 
     * @param {object} companies 
     */
    generateQuotesHtmlTemplate(filename, companies) {
        let html;
        ejs.renderFile(this.emails_path + filename, { companies }, (err, html_code) => {
            if (err) throw err;
            html = html_code;
        });

        return html;
    }

}

module.exports = new MailService;