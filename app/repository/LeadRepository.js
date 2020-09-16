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

            data = data.map(item => {
                item.property = JSON.parse(item.property);
                item.price = JSON.parse(item.price);

                return item;
            });

            return resolve(data);
        });
    },

    getOne(id) {
        return new Promise(async (resolve, reject) => {
            const data = await db.sequelize.query('SELECT leads.id, leads.empty, leads.fullname, users.fname, users.lname, leads.email, leads.property, leads.busy, status.name AS status, status.title AS status_title , states.name AS state, prices.price, leads.createdAt AS created FROM leads LEFT JOIN users ON leads.user_id = users.id LEFT JOIN status ON leads.status_id = status.id LEFT JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id WHERE leads.id = ' + id, {
                type: db.sequelize.QueryTypes.SELECT,
            }).catch(e => {
                console.error(e);
            });

            if (data) {
                const lead = data[0];
                lead.property = JSON.parse(lead.property);
                lead.price = JSON.parse(lead.price);

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

            data = data.map(item => {
                item.property = JSON.parse(item.property);
                item.price = JSON.parse(item.price);


                if (item.property.birth_date) {
                    item.property.birth_date = this.formatDate(item.property.birth_date)
                }

                item.createdAt = this.formatDate(item.createdAt, true);

                return item;
            });

            return resolve(data);
        });
    },

    getLatest(latestId) {
        return new Promise(async (resolve, reject) => {
            let data = await db.sequelize.query(`SELECT leads.id, leads.createdAt, leads.empty, leads.fullname, users.fname, users.lname, leads.email, leads.property, leads.busy, types.name AS type, status.name AS status, status.title AS status_title, states.name AS state, prices.price, leads.createdAt AS created FROM leads LEFT JOIN users ON leads.user_id = users.id INNER JOIN status ON leads.status_id = status .id LEFT JOIN states ON leads.state_id = states.id LEFT JOIN prices ON leads.id = prices.lead_id LEFT JOIN types ON leads.type_id = types.id WHERE leads.id IN ('${latestId.join("', '")}')`, {
                type: db.sequelize.QueryTypes.SELECT
            }).catch((e) => {
                console.error(e);
            });

            data = data.map(item => {
                item.property = JSON.parse(item.property);
                item.price = JSON.parse(item.price);

                if (item.property.birth_date) {
                    item.property.birth_date = this.formatDate(item.property.birth_date)
                }

                item.createdAt = this.formatDate(item.createdAt, true);

                return item;
            });

            return resolve(data);
        });
    },

    formatDate(date, time = null) {
        let newDate = new Date(date);
        const yy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(newDate);
        const mm = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(newDate);
        const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(newDate);
        const timeF =  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();;

        if (time) {
            return `${mm}/${dd}/${yy} ${timeF}`;
        }

        return mm + '/' + dd + '/' + yy;
    }
}

module.exports = LeadRepository;