const models = require('../../database/models/index')
const _ = require('lodash');

exports.processLead = async (lead) => {
    try {
        let property = await models.Leads.findOne({
            where: {
                email: lead.email
            }
        });

        if (_.isEmpty(property)) {
            property = await create(lead);
        } else {
            await update(property);
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

    if (_.isEmpty(propertyPrice)) {
        await models.Prices.create({
            quoter_id: quoterFromDB.id,
            lead_id: lead_id,
            price: JSON.stringify(price)
        });
    } else {
        await propertyPrice.update({
            price: price
        })
    }
}

/**
 * Leads functions 
 */
async function create(lead) {
    try {
        const source = await models.Sources.findOne({
            where: {
                name: lead.source
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

        await models.Leads.create({
            user_id: null,
            source_id: source.id,
            status_id: 1,
            type_id: type.id,
            email: lead.email,
            property: JSON.stringify(lead)
        });
    } catch (error) {
        console.error(error)
    }
}

async function update(property) {
    await property.update({
        user_id: null,
        source_id: source.id,
        status_id: status.id,
        type_id: type.id,
        email: lead.email,
        property: JSON.stringify(lead)
    });
}

