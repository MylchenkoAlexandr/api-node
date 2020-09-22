const db = require('../../database/models');

const LeadRepository = {
    getAll(type, states) {
        return new Promise(async (resolve, reject) => {
            let statesQuery = '';

            if (states) {
                let statesId = await db.sequelize.query(`SELECT states.id FROM states WHERE states.name IN ('${states.join("', '")}')`, {
                    type: db.sequelize.QueryTypes.SELECT,
                }).catch(e => {
                    console.error(e);
                });

                const stringOfStatesIds = statesId.map(elem => { return elem.id; }).join(', ');

                statesQuery = ` and leads.state_id in (${stringOfStatesIds})`;
            }

            let data = await db.sequelize.query(`SELECT leads.id, leads.empty, leads.fullname, users.fname, users.lname, leads.email, leads.property, leads.busy, status.name AS status, status.title AS status_title, states.name AS state, prices.price, leads.createdAt AS created FROM leads LEFT JOIN users ON leads.user_id = users.id INNER JOIN status ON leads.status_id = status .id INNER JOIN states ON leads.state_id = states.id INNER JOIN prices ON leads.id = prices.lead_id WHERE leads.empty = 0 AND leads.type_id = (SELECT types.id FROM types WHERE types.name = '${type}')` + statesQuery, {
                type: db.sequelize.QueryTypes.SELECT,
            }).catch((e) => {
                console.error(e);
            });

            data = data.map(lead => {
                lead.property = JSON.parse(lead.property);
                lead.price = JSON.parse(lead.price);

                lead.created = this.formatDate(lead.created, true);

                lead = { ...lead, ...lead.property };

                return lead;
            });

            return resolve(data);
        });
    },

    getOne(id) {
        return new Promise(async (resolve, reject) => {
            const data = await db.sequelize.query('SELECT leads.id, leads.phone, leads.empty, leads.fullname, users.fname, users.lname, leads.email, leads.property, leads.busy, status.name AS status, status.title AS status_title, states.name AS state, prices.price, leads.createdAt AS created, sources.name AS `source` FROM leads INNER JOIN sources ON sources.id = leads.source_id LEFT JOIN users ON leads.user_id = users.id LEFT JOIN status ON leads.status_id = status.id LEFT JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id WHERE leads.id = ' + id, {
                type: db.sequelize.QueryTypes.SELECT,
            }).catch(e => {
                console.error(e);
            });

            if (data) {
                let lead = data[0];

                lead.property = JSON.parse(lead.property);

                lead.price = JSON.parse(lead.price);

                lead = { ...lead, ...lead.property };

                lead.created = this.formatDate(lead.created, true);

                delete lead.property;

                return resolve(lead);
            }
        });
    },

    getEmptyAll() {
        return new Promise(async (resolve, reject) => {
            let data = await db.sequelize.query('SELECT leads.id, leads.createdAt, leads.empty, leads.fullname, users.fname, users.lname, leads.email, leads.property, leads.busy, types.name AS type, status.name AS status, status.title AS status_title, states.name AS state, prices.price, leads.createdAt AS created FROM leads LEFT JOIN users ON leads.user_id = users.id LEFT JOIN status ON leads.status_id = status .id LEFT JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id LEFT JOIN types ON leads.type_id = types.id WHERE leads.empty = 1', {
                type: db.sequelize.QueryTypes.SELECT
            }).catch((e) => {
                console.error(e);
            });

            data = data.map(lead => {
                lead.property = JSON.parse(lead.property);
                lead.price = JSON.parse(lead.price);

                if (lead.property.birth_date) {
                    lead.property.birth_date = this.formatDate(lead.property.birth_date)
                }

                lead = { ...lead, ...lead.property };

                lead.createdAt = this.formatDate(lead.createdAt, true);

                return lead;
            });

            return resolve(data);
        });
    },

    getRawLead(lead_id) {
        return new Promise(async (resolve, reject) => {
            let data = await db.sequelize.query('SELECT leads.id, leads.createdAt, leads.empty, leads.fullname, users.fname, users.lname, leads.email, leads.property, leads.busy, types.name AS type, status.name AS status, status.title AS status_title, states.name AS state, prices.price, leads.createdAt AS created FROM leads LEFT JOIN users ON leads.user_id = users.id INNER JOIN status ON leads.status_id = status .id LEFT JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id LEFT JOIN types ON leads.type_id = types.id WHERE leads.id = ' + lead_id, {
                type: db.sequelize.QueryTypes.SELECT
            }).catch((e) => {
                console.error(e);
            });

            if (data) {
                const lead = data[0];
                lead.property = JSON.parse(lead.property);
                lead.price = JSON.parse(lead.price);

                if ("birth_date" in lead.property) {
                    lead.property.birth_date = this.formatDate(lead.property.birth_date, false);
                }

                lead.createdAt = this.formatDate(lead.createdAt, true);

                return resolve(lead);
            }
        });
    },

    // getLatest(latestId) {
    //     return new Promise(async (resolve, reject) => {
    //         let data = await db.sequelize.query(`SELECT leads.id, leads.createdAt, leads.empty, leads.fullname, users.fname, users.lname, leads.email, leads.property, leads.busy, types.name AS type, status.name AS status, status.title AS status_title, states.name AS state, prices.price, leads.createdAt AS created FROM leads LEFT JOIN users ON leads.user_id = users.id INNER JOIN status ON leads.status_id = status.id LEFT JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id LEFT JOIN types ON leads.type_id = types.id WHERE leads.id IN ('${latestId.join("', '")}')`, {
    //             type: db.sequelize.QueryTypes.SELECT
    //         }).catch((e) => {
    //             console.error(e);
    //         });

    //         data = data.map(item => {
    //             item.property = JSON.parse(item.property);

    //             if (item.property.birth_date) {
    //                 item.property.birth_date = this.formatDate(item.property.birth_date)
    //             }

    //             item.createdAt = this.formatDate(item.createdAt, true);

    //             return item;
    //         });

    //         return resolve(data);
    //     });
    // },

    formatDate(date, time = null) {
        let newDate = new Date(date);
        const yy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(newDate);
        const mm = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(newDate);
        const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(newDate);
        const timeF = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric', second: 'numeric', }).format(newDate);

        if (time) {
            return `${mm}/${dd}/${yy} ${timeF}`;
        }

        return mm + '/' + dd + '/' + yy;
    }
}

module.exports = LeadRepository;