const models = require('../../database/models');
const NinjaQuoterService = require('./NinjaQuoterService');
const FormatService = require('./format.service');
const PriceService = require('./price.service');
const LeadRepository = require('../repository/LeadRepository');

class LeadService {
    /**
     * Create new lead
     * @param {object} lead 
     * @param {string} quoter 
     */
    async createLead(lead, quoter) {
        try {
            let { dataValues: createdLead } = await models.Leads.create({
                user_id: lead.user_id,
                source_id: lead.source_id,
                status_id: lead.status_id,
                type_id: lead.type_id,
                state_id: lead.state_id,
                empty: lead.empty,
                email: lead.email || null,
                phone: lead.phone || null,
                fullname: lead.fullname || null,
                property: JSON.stringify(lead.property)
            });

            if (createdLead.empty == 0) {
                const leadProperty = JSON.parse(createdLead.property);

                const formatedLeadForQuote = await FormatService.formatLeadForQuote(leadProperty);

                let guoter = new NinjaQuoterService(formatedLeadForQuote);

                const priceFromQuoter = await guoter.getPrice();

                await PriceService.processPrice(createdLead.id, priceFromQuoter, quoter);
            }

            return LeadRepository.getOne(createdLead.id);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Update exist lead record
     * @param {object} exist 
     * @param {object} lead 
     * 
     * @param {string} quoter 
     */
    async updateLead(exist, lead, quoter) {
        try {
            let { dataValues: updatedLead } = await exist.update({
                user_id: lead.user_id,
                source_id: lead.source_id,
                status_id: lead.status_id,
                type_id: lead.type_id,
                state_id: lead.state_id,
                empty: lead.empty,
                email: lead.email || null,
                phone: lead.phone || null,
                fullname: lead.fullname || null,
                property: JSON.stringify(lead.property)
            });

            if (updatedLead.empty == 0) {
                const leadProperty = JSON.parse(updatedLead.property);

                const formatedLeadForQuote = await FormatService.formatLeadForQuote(leadProperty);

                let guoter = new NinjaQuoterService(formatedLeadForQuote);

                const priceFromQuoter = await guoter.getPrice();

                await PriceService.processPrice(updatedLead.id, priceFromQuoter, quoter);
            }

            return LeadRepository.getOne(updatedLead.id);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Function for found exist lead
     * @param {object} formatedLead 
     */
    async foundExistLead(formatedLead) {
        let exist;

        try {
            if ("email" in formatedLead && "phone" in formatedLead) {
                exist = await models.Leads.findOne({
                    where: {
                        type_id: formatedLead.type_id,
                        email: formatedLead.email,
                        phone: formatedLead.phone
                    }
                });

                if (!exist) {
                    exist = await models.Leads.findOne({
                        where: {
                            type_id: formatedLead.type_id,
                            email: formatedLead.email
                        }
                    });

                    if (!exist) {
                        exist = await models.Leads.findOne({
                            where: {
                                type_id: formatedLead.type_id,
                                phone: formatedLead.phone
                            }
                        });
                    }
                }
            } else if ("email" in formatedLead && !("phone" in formatedLead)) {
                exist = await models.Leads.findOne({
                    where: {
                        type_id: formatedLead.type_id,
                        email: formatedLead.email
                    }
                });
            } else if ("phone" in formatedLead && !("email" in formatedLead)) {
                exist = await models.Leads.findOne({
                    where: {
                        type_id: formatedLead.type_id,
                        phone: formatedLead.phone
                    }
                });
            }

            return exist;
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = new LeadService;