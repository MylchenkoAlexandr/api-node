const db = require('../../database/models');

class DealsRepository {
    async getDeals(filters) {
        const { agents } = filters;
        try {
            let typeQuery = ' AND l.type_id = 2 ';
            let sourcesQuery = filters.sources.length ? ' AND l.source_id IN (' + filters.sources.join(', ') + ')' : " AND l.source_id = 0 ";

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

            let leads = await db.sequelize.query(`SELECT l.id, s.title s_t, l.fullname, l.email, l.phone, l.property, l.draft_date, l.app_date FROM leads l INNER JOIN status s ON s.id = l.status_id WHERE l.user_id = :user_id AND l.status_id IN (13, 20, 21, 22, 15, 16, 18, 14)${sourcesQuery}${typeQuery}${startEnd()}`, {
                replacements: {
                    user_id: agents
                },
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

                premiumCarrier = JSON.parse(premiumCarrier.premium_carrier);
                
                if(premiumCarrier){
                    let primary_index = Object.keys(premiumCarrier)[0];
                    lead["premium"] = premiumCarrier[primary_index];
                    lead["carrier"] = primary_index[0].toUpperCase() + primary_index.slice(1).split('_').join(' ');
                }

                if (lead.price) lead.price = JSON.parse(lead.price);
                return lead
            }))


            
            return leads;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DealsRepository();