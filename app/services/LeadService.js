const models = require('../../database/models');
const NinjaQuoterService = require('../services/NinjaQuoterService');
const _ = require('lodash');
const FormatService = require('./format.service')

async function processPrice(lead_id, price, quoter) {
    const quoterFromDB = await models.Quoters.findOne({
        where: { name: quoter }
    });

    const propertyPrice = await models.Prices.findOne({
        where: {
            quoter_id: quoterFromDB.id,
            lead_id: lead_id,
        }
    });

    const jsonInString = JSON.stringify(price);

    if (_.isEmpty(propertyPrice)) {
        await models.Prices.create({
            quoter_id: quoterFromDB.id,
            lead_id: lead_id,
            price: jsonInString
        });
    } else {
        await propertyPrice.update({
            price: jsonInString
        })
    }
}

async function asignAgent(agent_id, lead_id) {
    try {
        const lead = await models.Leads.findOne({
            where: {
                id: lead_id
            }
        });

        await lead.update({
            user_id: agent_id
        });
    } catch (error) {
        console.error(error);
    }
}

async function createLead(lead, quoter) {
    try {
        let { dataValues: createdLead } = await models.Leads.create({
            user_id: lead.user_id,
            source_id: lead.source_id,
            status_id: lead.status_id,
            type_id: lead.type_id,
            state_id: lead.state_id,
            empty: lead.empty,
            email: lead.email,
            phone: lead.phone,
            fullname: lead.fullname,
            property: JSON.stringify(lead.property)
        });

        const leadProperty = JSON.parse(createdLead.property);

        const formatedLeadForQuote = await FormatService.formatLeadForQuote(leadProperty);

        let guoter = new NinjaQuoterService(formatedLeadForQuote);

        const price = await guoter.getPrice();

        await processPrice(createdLead.id, price, "ninjaQuoter");
    } catch (err) {
        throw err;
    }
}

async function updateLead(exist, lead, quoter) {
    try {
        let { dataValues: updatedLead } = await exist.update({
            user_id: lead.user_id,
            source_id: lead.source_id,
            status_id: lead.status_id,
            type_id: lead.type_id,
            state_id: lead.state_id,
            empty: lead.empty,
            email: lead.email,
            phone: lead.phone,
            fullname: lead.fullname,
            property: JSON.stringify(lead.property)
        });

        const leadProperty = JSON.parse(updatedLead.property);

        const formatedLeadForQuote = await FormatService.formatLeadForQuote(leadProperty);

        let guoter = new NinjaQuoterService(formatedLeadForQuote);

        const price = await guoter.getPrice();

        await processPrice(updatedLead.id, price, "ninjaQuoter");
    } catch (err) {
        throw err;
    }
}

module.exports = {
    processPrice,
    asignAgent,
    createLead,
    updateLead
}