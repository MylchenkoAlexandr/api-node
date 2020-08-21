const models = require('../../database/models/index')
const _ = require('lodash');

exports.processLead = async (lead, agent_id = null) => {
    try {
        let property = await models.Leads.findOne({
            where: {
                email: lead.email
            }
        });

        const source = await models.Sources.findOne({
            where: {
                name: lead.source
            }
        }).then((result) => {
            return result;
        }).catch((err) => {
            console.error(err);
        });

        const state = await models.States.findOne({
            where: {
                name: lead.state
            }
        }).then((result) => {
            return result;
        }).catch((err) => {
            console.error(err);
        });

        const status = await models.Status.findOne({
            where: {
                name: lead.status
            }
        }).then((result) => {
            return result;
        }).catch((err) => {
            console.error(err);
        });

        const type = await models.Types.findOne({
            where: {
                name: lead.type
            }
        }).then((result) => {
            return result;
        }).catch((err) => {
            console.error(err);
        });

        if (_.isEmpty(property)) {
            property = await models.Leads.create({
                user_id: agent_id,
                source_id: source.id,
                status_id: 1,
                type_id: type.id,
                email: lead.email,
                state: state.id,
                property: JSON.stringify(lead)
            });
        } else {
            await property.update({
                user_id: agent_id,
                source_id: source.id,
                status_id: status.id,
                type_id: type.id,
                email: lead.email,
                state: state.id,
                property: JSON.stringify(lead)
            });
        }

        return property;
    } catch (error) {
        console.error(error)
    }
}

exports.processPrice = async (lead_id, price, quoter) => {
    const quoterFromDB = await models.Quoters.findOne({
        where: {
            name: quoter
        }
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

exports.asignAgent = async (agent_id, lead_id) => {
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


