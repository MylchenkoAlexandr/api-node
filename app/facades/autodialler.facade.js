const AutoDiallerService = require('../services/autodialler.service');
const models = require('../../database/models');
const TransformationHelper = require('../helpers/transformation.helper');
const _ = require('lodash');

class AutoDiallerFacade {
    async getLeadIdFromCall(field, id) {
        try {
            const leadId = await AutoDiallerService.getLeadIdFromCall(field, id);
            return { code: 201, status: "success", message: "Agent succesfull created", data: leadId };
        } catch (err) {
            throw err;
        }
    }
    callLeads(leads) {
        leads.forEach(async (item) => {
            let lead = await models.Leads.findOne({
                where: {
                    id: item.id
                }
            });

            if (!lead) return;

            let phone = TransformationHelper.formatPhoneForCall(lead.phone);
            await AutoDiallerService.outboundCall(phone, lead.id);
        });

        return { code: '200', status: 'success', message: "Calling leads" };
    }
}

module.exports = new AutoDiallerFacade;