const models = require('../../database/models');
const NinjaQuoterService = require('./NinjaQuoterService');
const FormatService = require('./format.service');
const PriceService = require('./price.service');
const LeadRepository = require('../repository/LeadRepository');
const AgentRepository = require('../repository/agent.repository');

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
                empty: lead.empty || 0,
                email: lead.email || null,
                phone: lead.phone || null,
                fullname: lead.fullname || null,
                property: JSON.stringify(lead.property)
            });

            if (createdLead) {
                if (createdLead.empty == 0) {
                    const leadProperty = lead.property;

                    const formatedLeadForQuote = await FormatService.formatLeadForQuote(leadProperty);

                    let guoter = new NinjaQuoterService(formatedLeadForQuote);

                    const priceFromQuoter = await guoter.getPrice();

                    await PriceService.processPrice(createdLead.id, priceFromQuoter, quoter);

                    return LeadRepository.getOne(createdLead.id);
                }

                return LeadRepository.getRawLead(createdLead.id);
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * Update exist lead record
     * @param {object} exist
     * @param {object} lead
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
                empty: lead.empty || 0,
                email: lead.email || null,
                phone: lead.phone || null,
                fullname: lead.fullname || null,
                property: JSON.stringify(lead.property)
            });

            if (updatedLead) {
                if (updatedLead.empty == 0) {
                    const leadProperty = JSON.parse(updatedLead.property);

                    const formatedLeadForQuote = await FormatService.formatLeadForQuote(leadProperty);

                    let guoter = new NinjaQuoterService(formatedLeadForQuote);

                    const priceFromQuoter = await guoter.getPrice();

                    await PriceService.processPrice(updatedLead.id, priceFromQuoter, quoter);

                    return LeadRepository.getOne(updatedLead.id);
                }

                return LeadRepository.getRawLead(updatedLead.id);
            }
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

    /** 
     * Function for get all leads
     * @param {string} type
     * @param {string} states
    */
    async getAll(type, user_id) {
        try {
            let leads;

            const role = await AgentRepository.getRole(user_id);

            if (role) {
                if (role == 'admin') {
                    leads = await LeadRepository.getAll(type);
                } else if (role == 'agent') {
                    leads = await LeadRepository.getByUserId(type, user_id);
                }
            }

            if (leads) {
                return leads;
            }
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Function for get one lead
     * @param {number} lead_id
    */
    async getOne(lead_id) {
        try {
            const lead = await LeadRepository.getOne(lead_id);
            
            return lead;
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Function for get all empty leads
    */
    async getRawLeads() {
        try {
            const row_leads = await LeadRepository.getEmptyAll();
            return row_leads;
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Function for get all blueberry leads
    */
    async blueberryLeads() {
        try {
            const leads = await LeadRepository.getLeadsBySource(1);

            return leads;
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Function for get all MediaAlpha leads
    */
    async mediaAlphaLeads() {
        try {
            const leads = await LeadRepository.getLeadsBySource(2);

            return leads;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Asign agent
     * @param {number} lead_id 
     * @param {number} user_id 
     */
    async asignAgent(lead_id, user_id) {
        let updatedLead = models.Leads.update({
            user_id: user_id
        }, {
            where: {
                id: lead_id
            }
        });

        return LeadRepository.getOne(updatedLead.id);
    }
}

module.exports = new LeadService;