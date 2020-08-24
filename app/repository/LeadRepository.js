
const db = require('../../database/models');

const LeadRepository = {
    getAll(type, states) {
        console.log("getAll -> states", states)
        return new Promise(async (resolve, reject) => {
            let statesQuery = ''
            if (states) {
                statesQuery = ` and leads.state_id in ((SELECT states.id FROM states WHERE states.name = '${states.fs}'), (SELECT states.id FROM states WHERE states.name = '${states.ls}'))`;
            }

            let data = await db.sequelize.query(`SELECT leads.id, users.fname, users.lname, leads.email, leads.property, STATUS .name AS STATUS , states.name AS state, prices.price, leads.createdAt AS created FROM leads INNER JOIN users ON leads.user_id = users.id INNER JOIN STATUS ON leads.status_id = STATUS .id INNER JOIN states ON leads.state_id = states.id INNER JOIN prices ON leads.id = prices.lead_id WHERE leads.type_id = (SELECT types.id FROM types WHERE types.name = '${type}')` + statesQuery, {
                type: db.sequelize.QueryTypes.SELECT,
            }).catch((e) => {
                console.error(e);
            });

            data = data.map((item) => {
                item.property = JSON.parse(item.property);
                item.price = JSON.parse(item.price);
                return item;
            });

            return resolve(data);
        });
    },
    getOne(id) {
        return new Promise(async (resolve, reject) => {

            const data = await db.sequelize.query('SELECT leads.id, users.fname, users.lname, leads.email, leads.property, status.name AS status , states.name AS state, prices.price, leads.createdAt AS created FROM leads INNER JOIN users ON leads.user_id = users.id INNER JOIN STATUS ON leads.status_id = STATUS.id INNER JOIN states ON leads.state_id = states.id INNER JOIN prices ON leads.id = prices.lead_id WHERE leads.id = ' + id, {
                type: db.sequelize.QueryTypes.SELECT,
            }).catch((e) => {
                console.error(e);
            });

            if (data) {
                const lead = data.map((item) => {
                    item.property = JSON.parse(item.property);
                    item.price = JSON.parse(item.price);
                    return item;
                });

                return resolve(lead);
            }
        });
    }
}

module.exports = LeadRepository