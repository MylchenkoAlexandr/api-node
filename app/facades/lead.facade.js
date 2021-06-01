const LeadService = require('../services/lead.service');
const NinjaQuoterService = require('../services/ninja-quoter.service');
const FormatService = require('../services/format.service');
const MailService = require('../services/mail.service');
const PriceService = require('../services/price.service');
const TransformationHelper = require('../helpers/transformation.helper');
const LeadRepository = require('../repository/lead.repository');
const UserRepository = require('../repository/user.repository');
const TelcastService = require('../telcastAPI/telcast.service');

class LeadFacade {
    /**
     * create new lead
     * @param {*} formatedLead 
     * @param {*} quoter 
     * @returns 
     */
    async createLead(formatedLead, quoter) {
        try {
            const createdLead = await LeadService.createLead(formatedLead);

            if (createdLead.empty == 0) {
                const leadProperty = JSON.parse(createdLead.property);
                if (quoter == "ninjaQuoter") {
                    const formatedLeadForQuote = FormatService.formatLeadForQuote(leadProperty);
                    const ninjaQuoterService = new NinjaQuoterService(formatedLeadForQuote);
                    const companies = await ninjaQuoterService.fetchCompanyListFromNinjaQuoter();
                    const companiesInfo = ninjaQuoterService.getCompaniesInfo(companies);
                    const priceFromQuoter = ninjaQuoterService.getPrice(companies);
                    await PriceService.processPrice(createdLead.id, priceFromQuoter, quoter);

                    if (companiesInfo.length !== 0) {
                        const email_sended = await LeadService.checkLeadAtSendedEmail(createdLead.email);

                        if (!email_sended) {
                            try {
                                const email_params = {
                                    companies: companiesInfo,
                                    email: createdLead.email,
                                    coverage_amount: leadProperty.coverage_amount,
                                    term: leadProperty.term,
                                    fullname: createdLead.fullname
                                }

                                email_params.term = email_params.term === 'fex' ? 'final expense' : email_params.term + ' year term';

                                if (typeof email_params.companiesInfo == 'string') {
                                    email_params.companiesInfo = JSON.parse(email_params.companiesInfo);
                                }

                                const html = MailService.generateQuotesHtmlTemplate('quote.ejs', email_params);

                                const mail_options = {
                                    from: `Blueberry Insurance <${process.env.MAIL_SERVICE_USER_EMAIL}>`,
                                    to: email_params.email,
                                    subject: `We saved your quote for ${email_params.term} life insurance of $${email_params.coverage_amount}`,
                                    html
                                };

                                await MailService.sendNewsletter(mail_options);
                                await LeadService.updateLeadAtSendedEmail(email_params.email, true);
                            } catch (error) {
                                throw error;
                            }
                        }
                    }
                }

                const lead = await LeadService.getOne(createdLead.id);

                if (lead.status_title == 'New Lead' && lead.source_title == 'mediaalpha') {
                    TelcastService.sendLead(lead);
                }

                return lead;
            }

            return await LeadService.getRawLead(createdLead.id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update exist lead
     * @param {*} exist 
     * @param {*} formatedLead 
     * @param {*} quoter 
     * @returns 
     */
    async updateLead(exist, formatedLead, quoter) {
        try {
            const updatedLead = await LeadService.updateLead(exist, formatedLead);

            if (updatedLead.empty == 0) {
                const leadProperty = JSON.parse(updatedLead.property);

                if (!updatedLead.post_sale && updatedLead.type_id === 2) {
                    const formatedLeadForQuote = FormatService.formatLeadForQuote(leadProperty);
                    const ninjaQuoterService = new NinjaQuoterService(formatedLeadForQuote);
                    const companies = await ninjaQuoterService.fetchCompanyListFromNinjaQuoter();
                    const companiesInfo = ninjaQuoterService.getCompaniesInfo(companies);
                    const priceFromQuoter = ninjaQuoterService.getPrice(companies);

                    await PriceService.processPrice(updatedLead.id, priceFromQuoter, quoter);

                    if (companiesInfo.length !== 0) {
                        const email_sended = await LeadService.checkLeadAtSendedEmail(updatedLead.email);

                        if (!email_sended) {
                            const email_params = {
                                companies: companiesInfo,
                                email: updatedLead.email,
                                coverage_amount: leadProperty.coverage_amount,
                                term: leadProperty.term,
                                fullname: updatedLead.fullname
                            }

                            email_params.term = email_params.term === 'fex' ? 'final expense' : email_params.term + ' year term';

                            if (typeof email_params.companiesInfo == 'string') {
                                email_params.companiesInfo = JSON.parse(email_params.companiesInfo);
                            }

                            const html = MailService.generateQuotesHtmlTemplate('quote.ejs', email_params);

                            const mail_options = {
                                from: `Blueberry Insurance <${process.env.MAIL_SERVICE_USER_EMAIL}>`,
                                to: email_params.email,
                                subject: `We saved your quote for ${email_params.term} life insurance of $${email_params.coverage_amount}`,
                                html
                            };

                            await MailService.sendNewsletter(mail_options);
                            await LeadService.updateLeadAtSendedEmail(email_params.email, true);
                        }
                    }
                }

                const lead = await LeadService.getOne(updatedLead.id);

                if (lead.status_title == 'New Lead' && lead.source_title == 'mediaalpha') {
                    TelcastService.sendLead(lead);
                }

                return lead;
            }

            return await LeadService.getRawLead(updatedLead.id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new LeadFacade;