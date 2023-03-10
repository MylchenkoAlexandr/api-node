const models = require('../../database/models');
const zipcodes = require('zipcodes');
const LeadRepository = require('../repository/lead.repository');
const AgentRepository = require('../repository/agent.repository');
const moment = require('moment-timezone');
const FormatService = require('../services/format.service');
const NinjaQuoterService = require('../services/ninja-quoter.service');

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
                second_phone: lead.second_phone || null,
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
                second_phone: lead.second_phone || null,
                fullname: lead.fullname || null,
                property: JSON.stringify(lead.property),
                draft_date: lead.draft_date,
                app_date: lead.app_date
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

                    if (!exist) {
                        exist = await models.Leads.findOne({
                            where: {
                                type_id: formatedLead.type_id,
                                phone: formatedLead.phone
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

                if (!exist && formatedLead.email) {
                    exist = await models.Leads.findOne({
                        where: {
                            type_id: formatedLead.type_id,
                            email: formatedLead.email,
                            fullname: formatedLead.fullname
                        }
                    });
                }

                if (!exist) {
                    exist = await models.Leads.findOne({
                        where: {
                            type_id: formatedLead.type_id,
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

            const updatedAt = moment(lead.updatedAt);
            lead.updatedAt = `${updatedAt.tz('America/Los_Angeles').format('L')} ${updatedAt.tz('America/Los_Angeles').format('LTS')}`;

            const createdAt = moment(lead.createdAt);
            lead.createdAt = `${createdAt.tz('America/Los_Angeles').format('L')} ${createdAt.tz('America/Los_Angeles').format('LTS')}`;
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
            const raw_leads = await LeadRepository.getEmptyAll();
            return raw_leads;
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

            let post_sale = 0;

            if (statusName === 'approved' ||
                statusName === 'in-force'
            ) {
                post_sale = 1;
            }

            await LeadRepository.updatePostSale(lead_id, post_sale);

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

    async updatePrice(lead_id, price) {
        try {
            return await LeadRepository.updatePrice(lead_id, price);
        } catch (error) {
            throw error;
        }
    }

    async getLeadsByFilters(params, limit, page) {
        try {
            const leads = await LeadRepository.getLeadsByFilters(params, limit, page);
            return leads;
        } catch (error) {
            throw error;
        }
    }

    async deleteLead(lead_id) {
        try {
            await models.Records.destroy({
                force: true,
                where: {
                    lead_id: lead_id
                }
            });

            await models.Emails.destroy({
                force: true,
                where: {
                    lead_id: lead_id
                }
            });

            await models.Sms.destroy({
                force: true,
                where: {
                    lead_id: lead_id
                }
            });

            await models.Beneficiaries.destroy({
                force: true,
                where: {
                    lead_id: lead_id
                }
            });

            await models.CustomersVoiceMails.destroy({
                force: true,
                where: {
                    lead_id: lead_id
                }
            });

            await models.Prices.destroy({
                force: true,
                where: {
                    lead_id: lead_id
                }
            });

            await models.Notes.destroy({
                force: true,
                where: {
                    lead_id: lead_id
                }
            });

            await models.Followups.destroy({
                force: true,
                where: {
                    lead_id: lead_id
                }
            });

            await models.Leads.destroy({
                force: true,
                where: {
                    id: lead_id
                }
            });

        } catch (error) {
            throw error;
        }
    }

    async getCompaniesList(rawLead) {
        try {
            const formatedLeadForQuote = FormatService.formatLeadForQuote(rawLead);
            const ninjaQuoterService = new NinjaQuoterService(formatedLeadForQuote);
            const companies = await ninjaQuoterService.fetchCompanyListFromNinjaQuoter();
            const companiesInfo = ninjaQuoterService.getCompaniesInfo(companies);

            return companiesInfo;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new LeadService;