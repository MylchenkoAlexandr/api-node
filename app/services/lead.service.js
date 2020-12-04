const models = require('../../database/models');
const zipcodes = require('zipcodes');
const LeadRepository = require('../repository/lead.repository');
const AgentRepository = require('../repository/agent.repository');

class LeadService {
    /**
     * Create new lead
     * @param {object} lead
     */
    async createLead(lead) {
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

            return createdLead;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Update exist lead record
     * @param {object} exist
     * @param {object} lead
     */
    async updateLead(exist, lead) {
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

            return updatedLead;
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
            if (!formatedLead.empty) {
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
            } else {
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

                    if (!exist) {
                        exist = await models.Leads.findOne({
                            where: {
                                type_id: formatedLead.type_id,
                                fullname: formatedLead.fullname
                            }
                        });
                    }
                }
            }

            return exist;
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * Get all leads for guide user
     */
    async getGuideLeads() {
        try {
            return await LeadRepository.getGuideLeads();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all leads skipping any params
     */
    async all() {
        try {
            const leads = await LeadRepository.All();
            return leads;
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Function for get all leads
     * @param {string} type
     * @param {number} user_id
    */
    async getAll(type, user_id) {
        try {
            const role = await AgentRepository.getRole(user_id);

            if (role == 'admin') return await LeadRepository.getAll(type);
            else if (role == 'agent') return await LeadRepository.getByUserId(type, user_id);
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
            const location = zipcodes.lookup(lead.zipcode);
            if (location) lead.city = location.city;

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
     * Function for get one empty lead
    */
    async getRawLead(lead_id) {
        try {
            return await LeadRepository.getRawLead(lead_id);
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Function for get all blueberry leads
    */
    async getLeadsBySource(source) {
        try {
            return await LeadRepository.getLeadsBySource(source);
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
            return await LeadRepository.getEmailSended(email_client);
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

    async getSuitableLeadsForCall(limit) {
        try {
            const leads = await LeadRepository.getSuitableLeadsForCall(limit);
            return leads;
        } catch (error) {
            throw error;
        }
    }

    async updateADstatusFields(lead_id, field, status) {
        try {
            const lead = await LeadRepository.updateADstatusFields(lead_id, field, status);
            return lead;
        } catch (error) {
            throw error;
        }
    }

    async phoneNumberSearcher(lead_id) { }


}

module.exports = new LeadService;