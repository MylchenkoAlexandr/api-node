const db = require('../../database/models');
const TransformationHelper = require('../helpers/transformation.helper');

const LeadRepository = {
    async getGuideLeads() {
        try {
            let data = await db.sequelize.query(`SELECT *, sources.title as source, leads.id as id, status.title as status, states.title as state, leads.updatedAt AS updated FROM leads INNER JOIN status ON status.id = leads.status_id LEFT JOIN sources ON sources.id = leads.source_id LEFT JOIN states ON states.id = leads.state_id WHERE leads.source_id IN (1, 2, 4, 5) AND leads.status_id IN (1, 2, 3, 4, 5, 11) AND leads.phone IS NOT NULL ORDER BY leads.id DESC;`, {
                type: db.sequelize.QueryTypes.SELECT,
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    async getAll(type, states) {
        try {
            let statesQuery = '';

            if (states) {
                let statesId = await db.sequelize.query(`SELECT states.id FROM states WHERE states.name IN ('${states.join("', '")}')`, {
                    type: db.sequelize.QueryTypes.SELECT,
                }).catch(e => {
                    console.error(e);
                });

                const stringOfStatesIds = statesId.map(elem => { return elem.id; }).join(', ');

                statesQuery = `and leads.state_id in (${stringOfStatesIds})`;
            }

            let data = await db.sequelize.query(`SELECT leads.id, leads.empty, leads.phone, leads.fullname, CONCAT(users.fname, ' ', users.lname) as agent_fullname, users.email as agent_email, leads.email, leads.property, leads.busy, sources.title AS source_title, sources.name AS source, status.name AS status, status.title AS status_title, states.name AS state, prices.price, leads.updatedAt FROM leads LEFT JOIN users ON leads.user_id = users.id INNER JOIN sources ON leads.source_id = sources.id INNER JOIN status ON leads.status_id = status.id INNER JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id WHERE leads.empty = 0 AND leads.type_id = (SELECT types.id FROM types WHERE types.name = '${type}') ${statesQuery} ORDER BY leads.id DESC;`, {
                type: db.sequelize.QueryTypes.SELECT,
            }).catch((e) => {
                console.error(e);
            });

            data = data.map(lead => {
                if (lead.property) {
                    lead.property = JSON.parse(lead.property)
                    lead = { ...lead, ...lead.property };
                };

                if (lead.price) lead.price = JSON.parse(lead.price);

                return lead;
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    async getOne(id) {
        try {
            let lead = await db.sequelize.query("SELECT leads.id, leads.AD_procced, leads.AD_status, leads.user_id, leads.state_id, leads.phone, leads.empty, leads.fullname, CONCAT(users.fname, ' ', users.lname) as agent_fullname, users.email as agent_email, leads.email, leads.property, leads.busy, leads.post_sale, leads.type_id, status.name AS status, status.title AS status_title, states.name AS state, states.title AS state_title, prices.price, prices.premium_carrier as pc, leads.updatedAt AS updated, sources.name AS source, sources.name AS source_title, types.name as type FROM leads INNER JOIN sources ON sources.id = leads.source_id LEFT JOIN users ON leads.user_id = users.id LEFT JOIN status ON leads.status_id = status.id LEFT JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id LEFT JOIN types ON types.id = leads.type_id WHERE leads.id = " + id, {
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });

            if (lead.property) {
                lead.property = JSON.parse(lead.property);
                if (lead.property.state) delete lead.property.state;
                lead = { ...lead, ...lead.property };

                delete lead.property;
            }

            if (lead.price) lead.price = JSON.parse(lead.price);

            if (lead.birth_date) lead.age = TransformationHelper.calculateAge(...lead.birth_date.split('-'));

            if (lead.weight && lead.height) lead.bmi = TransformationHelper.calculateBMI(lead.weight, lead.height);

            return lead;
        } catch (error) {
            throw error;
        }
    },

    async getEmptyAll() {
        try {
            let data = await db.sequelize.query("SELECT leads.id, leads.createdAt, leads.empty, leads.phone, leads.fullname, CONCAT(users.fname, ' ', users.lname) as agent_fullname, leads.email, leads.property, leads.busy, types.name AS type, sources.title AS source_title, sources.name AS source, status.name AS status, status.title AS status_title, states.name AS state, prices.price, leads.updatedAt AS updated FROM leads LEFT JOIN users ON leads.user_id = users.id INNER JOIN sources ON leads.source_id = sources.id LEFT JOIN status ON leads.status_id = status.id LEFT JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id LEFT JOIN types ON leads.type_id = types.id WHERE leads.empty = 1 AND (leads.phone IS NOT NULL OR leads.email IS NOT NULL) ORDER BY leads.id DESC;", {
                type: db.sequelize.QueryTypes.SELECT
            });

            data = data.map(lead => {
                lead.property = JSON.parse(lead.property);
                lead.price = JSON.parse(lead.price);

                if (lead.property.birth_date) {
                    lead.property.birth_date = TransformationHelper.formatDate(lead.property.birth_date)
                }

                lead = { ...lead, ...lead.property };

                if ('property' in lead) delete lead.property;

                return lead;
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    async getRawLead(lead_id) {
        try {
            let lead = await db.sequelize.query("SELECT leads.id, leads.createdAt, leads.empty, leads.phone, leads.fullname, CONCAT(users.fname, ' ', users.lname) as agent_fullname, leads.email, leads.property, leads.busy, types.name AS type, sources.title AS source_title, sources.name AS source, status.name AS status, status.title AS status_title, states.name AS state, prices.price, leads.updatedAt AS updated FROM leads LEFT JOIN users ON leads.user_id = users.id INNER JOIN sources ON leads.source_id = sources.id LEFT JOIN status ON leads.status_id = status.id LEFT JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id LEFT JOIN types ON leads.type_id = types.id WHERE leads.empty = 1 AND leads.id = " + lead_id + " AND (leads.phone IS NOT NULL OR leads.email IS NOT NULL)", {
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });

            if (lead.property != null) {
                lead.property = JSON.parse(lead.property);
            }

            lead.price = JSON.parse(lead.price);

            lead = { ...lead, ...lead.property };

            return lead;
        } catch (error) {
            throw error;
        }
    },

    async getByUserId(type, user_id) {
        try {
            let data = await db.sequelize.query("SELECT leads.id, leads.user_id, leads.phone, leads.empty, leads.fullname, CONCAT(users.fname, ' ', users.lname) as agent_fullname, users.email as agent_email, leads.email, leads.property, leads.busy, status.name AS status, status.title AS status_title, states.name AS state, prices.price, leads.updatedAt AS updated, sources.title AS source_title, sources.name AS source FROM leads INNER JOIN sources ON sources.id = leads.source_id LEFT JOIN users ON leads.user_id = users.id LEFT JOIN status ON leads.status_id = status.id LEFT JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id WHERE leads.user_id = '" + user_id + "' AND leads.type_id = (SELECT types.id FROM types WHERE types.name = '" + type.toLowerCase() + "') ORDER BY leads.id DESC;", {
                type: db.sequelize.QueryTypes.SELECT,
            })
            data = data.map(lead => {
                lead.property = JSON.parse(lead.property);

                if ("agent_fullname" in lead.property) {
                    delete lead.property.agent_fullname
                }

                if ("agent_email" in lead.property) {
                    delete lead.property.agent_email
                }

                lead.price = JSON.parse(lead.price);
                lead = { ...lead, ...lead.property };

                return lead;
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    async getLeadsBySource(source) {
        try {
            let data = await db.sequelize.query(`SELECT leads.id, leads.empty, leads.fullname, leads.phone, users.fname, users.lname, users.email as agent_email, CONCAT(users.fname, ' ', users.lname) as agent_fullname, leads.email, leads.property, leads.busy, sources.title AS source_title, sources.name AS source, status.name AS status, status.title AS status_title, states.name AS state, prices.price, leads.updatedAt FROM leads LEFT JOIN users ON leads.user_id = users.id INNER JOIN sources ON leads.source_id = sources.id INNER JOIN status ON leads.status_id = status.id INNER JOIN states ON leads.state_id = states.id INNER JOIN prices ON leads.id = prices.lead_id WHERE leads.empty = 0 AND sources.name = "${source}" ORDER BY leads.id DESC;`, {
                type: db.sequelize.QueryTypes.SELECT,
            });

            data = data.map(lead => {
                lead.property = JSON.parse(lead.property);
                lead.price = JSON.parse(lead.price);

                lead = { ...lead, ...lead.property };

                return lead;
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    async getAssignUserID(lead_id) {
        try {
            const data = await db.sequelize.query('SELECT leads.user_id FROM leads WHERE leads.id = ' + lead_id, {
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });

            return data.user_id;
        } catch (error) {
            throw error;
        }
    },

    async getEmailSended(email_client) {
        try {
            const data = await db.sequelize.query(`SELECT leads.email_sended FROM leads WHERE leads.email = "${email_client}"`, {
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });

            return data.email_sended;
        } catch (error) {
            throw error;
        }
    },

    /**
     * 
     * @param {integer} limit count of leads neede
     */
    async getSuitableLeadsForCall(limit = null) {
        try {
            let limitLeads = ';';

            if (limit) {
                limitLeads = " LIMIT " + limit;
            }

            let data = await db.sequelize.query(`SELECT *, sources.title as source_title, leads.id as id, status.title as status_title, states.title as state_title FROM leads INNER JOIN status ON status.id = leads.status_id LEFT JOIN sources ON sources.id = leads.source_id LEFT JOIN states ON states.id = leads.state_id WHERE leads.source_id IN (1, 2, 4, 5) AND leads.status_id IN (1, 11) AND leads.AD_status NOT IN(1, 2, 4) AND leads.phone IS NOT NULL ORDER BY leads.id DESC` + limitLeads, {
                type: db.sequelize.QueryTypes.SELECT,
            });

            if (limit) {
                return data[0];
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    async updateADstatusFields(lead_id, field, status) {
        try {
            let data = await db.sequelize.query(`UPDATE leads SET leads.${field} = ${status} WHERE leads.id = ${lead_id};`, {
                type: db.sequelize.QueryTypes.UPDATE,
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    async updatePostSale(lead_id, post_sale = 0) {
        try {
            let data = await db.sequelize.query(`UPDATE leads SET leads.post_sale = ${post_sale} WHERE leads.id = ${lead_id};`, {
                type: db.sequelize.QueryTypes.UPDATE,
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    async updatePrice(lead_id, price) {
        try {
            let data = await db.sequelize.query(`UPDATE prices SET prices.price = '${price}' WHERE prices.lead_id = ${lead_id};`, {
                type: db.sequelize.QueryTypes.UPDATE,
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    async getLeadsByFilters(params) {
        try {
            let where = '';

            if (params.agent.length) {
                where += '('
                params.agent.forEach((agent, idx) => {
                    if (agent === 0) {
                        where += idx !== params.agent.length - 1 ? 'leads.user_id IS NULL OR ' : 'leads.user_id IS NULL';
                    } else {
                        where += idx !== params.agent.length - 1 ? 'leads.user_id=' + agent + ' OR ' : 'leads.user_id=' + agent;
                    }
                });
                where += ') AND ';
            } else {
                where += 'leads.user_id=-1 AND ';
            }

            if (params.status.length) {
                where += '(';
                params.status.forEach((status, idx) => {
                    where += idx !== params.status.length - 1 ? 'leads.status_id=' + status + ' OR ' : 'leads.status_id=' + status;
                });
                where += ') AND ';
            } else {
                where += 'leads.status_id=-1 AND ';
            }

            if (params.state.length) {
                where += '(';
                params.state.forEach((state, idx) => {
                    where += idx !== params.state.length - 1 ? 'leads.state_id=' + state + ' OR ' : 'leads.state_id=' + state;
                });
                where += ') AND ';
            } else {
                where += 'leads.state_id=-1 AND ';
            }

            if (params.source) {
                where += 'leads.source_id=' + params.source + ' AND ';
            }

            let data = await db.sequelize.query(`SELECT leads.id, leads.empty, leads.fullname, users.fname, users.lname, users.email as agent_email, leads.phone, CONCAT(users.fname, ' ', users.lname) as agent_fullname, leads.email, leads.property, leads.busy, sources.title AS source_title, sources.name AS source, status.name AS status, status.title AS status_title, states.name AS state, prices.price, prices.premium_carrier as pc, leads.updatedAt FROM leads LEFT JOIN users ON leads.user_id = users.id INNER JOIN sources ON leads.source_id = sources.id INNER JOIN status ON leads.status_id = status.id INNER JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id WHERE ${where} leads.empty = 0 AND leads.type_id = :type_id ORDER BY leads.id DESC;`, {
                replacements: { type_id: params.type },
                type: db.sequelize.QueryTypes.SELECT,
            });

            data = data.map(lead => {
                lead.property = JSON.parse(lead.property);
                lead.price = JSON.parse(lead.price);

                lead = { ...lead, ...lead.property };

                return lead;
            });

            return data;
        } catch (error) {
            throw error;
        }

    }
}

module.exports = LeadRepository;