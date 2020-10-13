const MailService = require('../services/mail.service');
const LeadService = require('../services/lead.service');

class MailFacade {
    async sendEmailWithCompanies(email_params) {
        try {
            const email_sended = await LeadService.checkLeadAtSendedEmail(email_params.email);

            if (!email_sended) {

                if (typeof email_params.companies == 'string') {
                    email_params.companies = JSON.parse(email_params.companies);
                }
                
                const html = MailService.generateQuotesHtmlTemplate('quote.ejs', email_params);

                const mail_options = {
                    from: `Blueberry Insurance <${process.env.MAIL_SERVICE_USER_EMAIL}>`,
                    to: email_params.email,
                    subject: `To: ${email_params.contact}, From: ❤️ @ Blueberry`,
                    html
                };

                await MailService.send(mail_options);
                await LeadService.updateLeadAtSendedEmail(email_params.email, true);
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MailFacade;