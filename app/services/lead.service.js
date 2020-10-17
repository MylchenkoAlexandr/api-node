const models = require('../../database/models');
const NinjaQuoterService = require('./ninja-quoter.service');
const FormatService = require('./format.service');
const PriceService = require('./price.service');
const LeadRepository = require('../repository/lead.repository');
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
            exist = await models.Leads.findOne({
                where: {
                    type_id: formatedLead.type_id,
                    email: formatedLead.email,
                    phone: formatedLead.phone,
                    fullname: formatedLead.fullname
                }
            });

            if (!exist) {
                exist = await models.Leads.findOne({
                    where: {
                        type_id: formatedLead.type_id,
                        phone: formatedLead.phone,
                        fullname: formatedLead.fullname
                    }
                });

                if (!exist) {
                    exist = await models.Leads.findOne({
                        where: {
                            type_id: formatedLead.type_id,
                            email: formatedLead.email,
                            fullname: formatedLead.fullname
                        }
                    });
                }
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
                console.log("getAll -> leads", leads)
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
     * Function for get all MediaAlpha leads
    */
   async manualLeads() {
    try {
        const leads = await LeadRepository.getLeadsBySource(3);

        return leads;
    } catch (error) {
        throw error;
    }
}

 /** 
     * Function for get all MediaAlpha leads
    */
   async bulkLeads() {
    try {
        const leads = await LeadRepository.getLeadsBySource(4);

        return leads;
    } catch (error) {
        throw error;
    }
}

 /** 
     * Function for get all MediaAlpha leads
    */
   async clickListingLeads() {
    try {
        const leads = await LeadRepository.getLeadsBySource(5);

        return leads;
    } catch (error) {
        throw error;
    }
}

    /**
     * Assign agent
     * @param {number} lead_id 
     * @param {number} user_id 
     */
    async assignAgent(lead_id, user_id) {
        try {
            let lead = await models.Leads.findOne({
                where: {
                    id: lead_id
                }
            });

            if (lead) {
                let updatedLead = await lead.update({
                    user_id: user_id
                });

                if (updatedLead) {
                    return await LeadRepository.getOne(updatedLead.id);
                }
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {number} lead_id 
     * @param {number} user_id 
     */
    async agentIsAssigned(lead_id, user_id) {
        try {
            const assign_user_id = await LeadRepository.getAssignUserID(lead_id);
            const agent_role = await AgentRepository.getRole(user_id);

            if (agent_role === 'admin') {
                return true;
            }
            else if (assign_user_id == user_id) {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    async checkLeadAtSendedEmail(email_client) {
        try {
            const email_sended = await LeadRepository.getEmailSended(email_client);

            return email_sended;
        } catch (error) {
            throw error;
        }
    }

    async updateLeadAtSendedEmail(email_client, email_sended) {
        try {
            const lead = await models.Leads.findOne(
                { where: { email: email_client } }
            );

            if (lead) await lead.update({ email_sended: email_sended });
        } catch (error) {
            throw error;
        }
    }

    async updateStatus(lead_id, statusName) {
        try {
            const updatedLead = await models.Leads.findOne({
                where: {
                    id: lead_id
                }
            });

            if (updatedLead) {
                const status = await models.Status.findOne({
                    attributes: ['id'],
                    where: {
                        name: statusName
                    }
                });

                if (status) {
                    await updatedLead.update({
                        status_id: status.id
                    });

                    return await LeadRepository.getOne(updatedLead.id);
                }
            }

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new LeadService;