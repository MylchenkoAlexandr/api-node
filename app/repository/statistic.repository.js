const db = require('../../database/models');

class StatisticRepository {
    /**
     * 
     * @param {*} filters 
     * @returns 
     */
    async getStatistic(filters) {
        try {
            let typeQuery = filters.types.length ? ' AND l.type_id IN (' + filters.types.join(', ') + ')' : " AND l.type_id = 0 ";
            let sourcesQuery = filters.sources.length ? ' AND l.source_id IN (' + filters.sources.join(', ') + ')' : " AND l.source_id = 0 ";
            let agentsQuery = filters.agents.length ? ' AND u.id IN (' + filters.agents.join(', ') + ')' : " AND l.id = 0 ";

            const startEnd = () => {
                let query = '';

                if (filters.date.length == 2) {
                    filters.date.sort();
                    let start = filters.date[0] + ' ' + '00:00:00';
                    let end = filters.date[1] + ' ' + '23:59:59';

                    query = " AND ( l.createdAt BETWEEN '" + start + "' AND '" + end + "')";
                }

                return query;
            }

            const statInfo = await db.sequelize.query(`SELECT u.id, CONCAT(u.fname, ' ', u.lname) agent, COUNT(l.id) c_a, (SELECT COUNT(l.id) FROM leads l WHERE l.user_id = u.id AND l.status_id IN (13, 20, 21, 22, 15, 16, 18, 14)${sourcesQuery}${typeQuery}${startEnd()}) c_d, (SELECT COUNT(l.id) FROM leads l WHERE l.user_id = u.id AND l.status_id IN (13, 20, 21, 22, 15, 16, 18, 14)${sourcesQuery}${typeQuery}${startEnd()})/COUNT(l.id)*100 c_r FROM users u INNER JOIN leads l ON l.user_id = u.id WHERE u.role_id = 2${agentsQuery}${sourcesQuery}${typeQuery}${startEnd()} GROUP BY u.fname ORDER BY u.fname`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            for (const [index, agent] of Object.entries(statInfo)) {
                let TMP = 0;
                let CSA = 0;

                let premiumPrice = await db.sequelize.query(`SELECT p.premium_carrier FROM leads l INNER JOIN prices p ON p.lead_id = l.id WHERE l.user_id = :user_id AND l.status_id IN (13, 20, 21, 22, 15, 16, 18, 14)${sourcesQuery}${typeQuery}${startEnd()}`, {
                    replacements: {
                        user_id: agent.id
                    },
                    type: db.sequelize.QueryTypes.SELECT
                });

                let leads = await db.sequelize.query(`SELECT l.id, s.title s_t, l.fullname, l.email, l.phone FROM leads l INNER JOIN status s ON s.id = l.status_id WHERE l.user_id = :user_id AND l.status_id IN (13, 20, 21, 22, 15, 16, 18, 14)${sourcesQuery}${typeQuery}${startEnd()}`, {
                    replacements: {
                        user_id: agent.id
                    },
                    type: db.sequelize.QueryTypes.SELECT
                });

                premiumPrice.map(p => {
                    if (p.premium_carrier) {
                        p.premium_carrier = JSON.parse(p.premium_carrier);
                        TMP += +p.premium_carrier[Object.keys(p.premium_carrier)];
                        CSA += 1;
                    }
                });

                TMP = TMP ? TMP : 0;
                let AMP = TMP / CSA ? TMP / CSA : 0;

                statInfo[index].c_r = `${parseInt(agent.c_r)}%`;
                statInfo[index].tmp = `$${TMP.toFixed(2)}`;
                statInfo[index].amp = `$${AMP.toFixed(2)}`;
                statInfo[index].leads = leads;
            }

            return statInfo;
        } catch (error) {
            throw error;
        }
    }

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
            let leads = await db.sequelize.query(`SELECT l.id, s.title s_t, l.fullname, l.email, l.phone, l.property, l.draft_date, l.app_date, CONCAT(u.fname, ' ', u.lname) agent FROM leads l INNER JOIN status s ON s.id = l.status_id INNER JOIN users u ON l.user_id = u.id WHERE ${agentsQuery} l.status_id IN (13, 20, 21, 22, 15, 16, 18, 14)${sourcesQuery}${typeQuery}${startEnd()}`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            leads = await Promise.all(leads.map(async lead => {
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


                if (premiumCarrier && premiumCarrier.premium_carrier) {
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
            leads.forEach(lead => {
                if (lead.coverage_amount) {
                    totalCoverage += +lead.coverage_amount;
                }

                if (lead.premium) {
                    totalPremium += +lead.premium;
                }
            });

            return { totalCoverage, totalPremium, leads };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StatisticRepository();