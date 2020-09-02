const models = require('../../database/models');
const NinjaQuoterService = require('../services/NinjaQuoterService');
const _ = require('lodash');

async function processLead(lead, agent_id = null) {
    try {
        const property = await models.Leads.findOne({
            where: { email: lead.email }
        });

        const source = await models.Sources.findOne({
            where: { name: lead.source }
        });

        const state = await models.States.findOne({
            where: { name: lead.state }
        });

        const status = await models.Status.findOne({
            where: { name: lead.status }
        });

        const type = await models.Types.findOne({
            where: { name: lead.type }
        });

        if (_.isEmpty(property) && source && state && status && type) {
            return new Promise((resolve, reject) => {
                models.Leads.create({
                    user_id: agent_id,
                    source_id: source.id,
                    status_id: 1,
                    type_id: type.id,
                    fullname: lead.fname + lead.lname || lead.contact,
                    email: lead.email,
                    state_id: state.id,
                    property: JSON.stringify(lead)
                }).then(res => {
                    return resolve(res.dataValues);
                }).catch(err => {
                    return reject(err);
                });
            });

        } else {
            return new Promise((resolve, reject) => {
                property.update({
                    user_id: agent_id,
                    source_id: source.id,
                    status_id: status.id,
                    type_id: type.id,
                    fullname: lead.fname + lead.lname || lead.contact,
                    email: lead.email,
                    state: state.id,
                    property: JSON.stringify(lead)
                }).then(res => {
                    return resolve(res.dataValues.id);
                }).catch(err => {
                    return reject(err);
                });
            });
        }

    } catch (error) {
        console.error(error)
    }
}

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

async function createLead(lead, quoter, agentId = null) {
    const preferedCompanies = {
        mutual_omaha_express: 0,
        foresters_express: 0,
        sagicor_express_issue: 0,
        american_general: 0
    };

    const preferedCompaniesFEX = {
        mutual_omaha: 0,
        royal_neighbors: 0,
        liberty_bankers: 0,
    };

    try {
        const source = await models.Sources.findOne({
            where: { name: lead.property.source }
        });

        const state = await models.States.findOne({
            where: { name: lead.property.state }
        });

        const type = await models.Types.findOne({
            where: { name: lead.property.type }
        });

        if (source && state && type) {
            return new Promise((resolve, reject) => {
                models.Leads.create({
                    user_id: agentId,
                    source_id: source.id,
                    status_id: 1,
                    type_id: type.id,
                    email: lead.property.email,
                    fullname: lead.property.fname + ' ' + lead.property.lname || lead.property.contact,
                    state_id: state.id,
                    property: JSON.stringify(lead.property)
                }).then(async res => {
                    const newLead = JSON.parse(res.dataValues.property);
                    const quoterInfo = {
                        birthdate: newLead.birth_date,
                        smoker: Boolean(+newLead.tobacco),
                        rate_class: newLead.rateClass,
                        term: newLead.term,
                        coverage: newLead.coverage_amount,
                        state: newLead.state,
                        gender: newLead.gender
                    };

                    let quotes = null;

                    switch (quoter) {
                        case "ninjaQuoter":
                            quotes = new NinjaQuoterService(quoterInfo.term == 'fex' ? preferedCompaniesFEX : preferedCompanies, quoterInfo);
                    }

                    try {
                        const price = await quotes.getPrice();
                        if (price) {
                            await processPrice(res.dataValues.id, price, "ninjaQuoter");

                            return resolve(res.dataValues);
                        }
                    } catch (error) {
                        console.error("createLead -> error", error)
                    }
                }).catch(err => {
                    return reject(err);
                });
            });
        }
    } catch (error) {
        console.error(error)
    }
}

async function updateLead(exist, lead, quoter, agentId = null) {
    const preferedCompanies = {
        mutual_omaha_express: 0,
        foresters_express: 0,
        sagicor_express_issue: 0,
        american_general: 0
    };

    const preferedCompaniesFEX = {
        mutual_omaha: 0,
        royal_neighbors: 0,
        liberty_bankers: 0,
    };

    try {
        const source = await models.Sources.findOne({
            where: { name: lead.property.source }
        });

        const state = await models.States.findOne({
            where: { name: lead.property.state }
        });

        const status = await models.Status.findOne({
            where: { name: lead.property.status }
        });

        const type = await models.Types.findOne({
            where: { name: lead.property.type }
        });

        if (source && state && status && type) {
            return new Promise((resolve, reject) => {
                exist.update({
                    user_id: agentId,
                    status_id: status.id,
                    email: lead.property.email,
                    fullname: lead.property.fname + ' ' + lead.property.lname || lead.property.contact,
                    state_id: state.id,
                    property: JSON.stringify(lead.property)
                }).then(async res => {
                    const newLead = JSON.parse(res.dataValues.property);

                    const quoterInfo = {
                        birthdate: newLead.birth_date,
                        smoker: !!+newLead.tobacco,
                        rate_class: newLead.rateClass,
                        term: newLead.term,
                        coverage: newLead.coverage_amount,
                        state: newLead.state,
                        gender: newLead.gender
                    };

                    let quotes = null;

                    switch (quoter) {
                        case "ninjaQuoter":
                            quotes = new NinjaQuoterService(quoterInfo.term == 'fex' ? preferedCompaniesFEX : preferedCompanies, quoterInfo);
                    }

                    try {
                        const price = await quotes.getPrice();
                        console.log("updateLead -> price", price)

                        if (price) {
                            await processPrice(res.dataValues.id, price, "ninjaQuoter");

                            return resolve(res.dataValues);
                        }
                    } catch (error) {
                        console.error("createLead -> error", error)
                    }

                }).catch(err => {
                    return reject(err);
                });
            });
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    processLead,
    processPrice,
    asignAgent,
    createLead,
    updateLead
}