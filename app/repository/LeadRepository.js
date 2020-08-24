
const db = require('../../database/models');

const LeadRepository = {
    getAll() {
        return new Promise(async (resolve, reject) => {

            let data = await db.sequelize.query('SELECT leads.id, users.fname, users.lname, leads.email, leads.property, status.name AS status, states.name AS state, prices.price, leads.createdAt as created FROM leads INNER JOIN users ON leads.user_id = users.id INNER JOIN status ON leads.status_id = status.id INNER JOIN states ON leads.state_id = states.id INNER JOIN prices ON leads.id = prices.lead_id', {
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

            let data = await db.sequelize.query('SELECT leads.id, users.fname, users.lname, leads.email, leads.property, STATUS .name AS STATUS , states.name AS state, prices.price, leads.createdAt AS created FROM leads INNER JOIN users ON leads.user_id = users.id INNER JOIN STATUS ON leads.status_id = STATUS .id INNER JOIN states ON leads.state_id = states.id INNER JOIN prices ON leads.id = prices.lead_id WHERE leads.id = ' + id, {
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
    }
}

module.exports = LeadRepository