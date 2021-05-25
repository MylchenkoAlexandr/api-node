const db = require('../../database/models');

class DealsRepository {
    /**
     * Getting filtered deals according to agents, sources, types and time
     * @param {Array} filters 
     * @returns {Object}
     */
    async getDeals(filters) {
        const { agents, sources, types, date } = filters;
        try {

            let typeQuery = types.length ? ' AND l.type_id IN (' + types.join(', ') + ')' : " AND l.type_id = 0 ";
            let sourcesQuery = sources.length ? ' AND l.source_id IN (' + sources.join(', ') + ')' : " AND l.source_id = 0 ";
            let agentsQuery = agents.length ? ' l.user_id IN (' + agents.join(', ') + ') AND' : "";

            const startEnd = () => {
                let query = '';

                if (date.length == 2) {
                    date.sort();
                    let start = date[0] + ' ' + '00:00:00';
                    let end = date[1] + ' ' + '23:59:59';

                    query = " AND ( l.createdAt BETWEEN '" + start + "' AND '" + end + "')";
                }

                return query;
            }
            let leads = await db.sequelize.query(`SELECT l.id, s.title s_t, l.fullname, l.email, l.phone, l.property, l.draft_date, l.app_date, CONCAT(u.fname, ' ', u.lname) agent FROM leads l INNER JOIN status s ON s.id = l.status_id INNER JOIN users u ON l.user_id = u.id WHERE ${agentsQuery } l.status_id IN (13, 20, 21, 22, 15, 16, 18, 14)${sourcesQuery}${typeQuery}${startEnd()}`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            leads  = await Promise.all(leads.map( async lead => {
                if (lead.property) {
                    lead.property = JSON.parse(lead.property)
                    lead = { ...lead, ...lead.property };
                };

                let premiumCarrier = await db.sequelize.query("SELECT p.premium_carrier FROM prices p WHERE p.lead_id = :lead_id",
                    {
                        replacements: {
                            lead_id: lead.id
                        },
                        type: db.sequelize.QueryTypes.SELECT,
                        plain: true
                    });

                    
                if(premiumCarrier && premiumCarrier.premium_carrier){
                    premiumCarrier = JSON.parse(premiumCarrier.premium_carrier);
                    let primary_index = Object.keys(premiumCarrier)[0];
                    lead["premium"] = premiumCarrier[primary_index];
                    lead["carrier"] = primary_index[0].toUpperCase() + primary_index.slice(1).split('_').join(' ');
                }

                if (lead.price) lead.price = JSON.parse(lead.price);
                return lead
            }))


            let totalCoverage = 0;
            let totalPremium = 0;
            leads.forEach( lead => {
                if (lead.coverage_amount) {
                    totalCoverage += +lead.coverage_amount;
                }

                if (lead.premium) {
                    totalPremium += +lead.premium;
                }
            });

            return { totalCoverage, totalPremium, leads};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DealsRepository();