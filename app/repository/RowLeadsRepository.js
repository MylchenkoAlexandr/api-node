const db = require('../../database/models');

const RowLeadsRepository = {

    getAll() {
        return new Promise(async (resolve, reject) => {
            let data = await db.sequelize.query('SELECT row_leads.id, row_leads.fullname, row_leads.email, row_leads.phone, row_leads.dob, row_leads.createdAt FROM row_leads', {
                type: db.sequelize.QueryTypes.SELECT
            }).catch((e) => {
                console.error(e);
            });

            return resolve(data);
        });
    },

    getLatest(latestId) {
        return new Promise(async (resolve, reject) => {
            let data = await db.sequelize.query(`SELECT row_leads.id, row_leads.fullname, row_leads.email, row_leads.phone, row_leads.dob, row_leads.createdAt FROM row_leads WHERE row_leads.id IN ('${latestId.join("', '")}')`, {
                type: db.sequelize.QueryTypes.SELECT
            }).catch((e) => {
                console.error(e);
            });

            return resolve(data);
        });
    },

    getOne(lead_id) {
        return new Promise(async (resolve, reject) => {
            let data = await db.sequelize.query('SELECT row_leads.id, row_leads.fullname, row_leads.email, row_leads.phone, row_leads.dob, row_leads.createdAt FROM row_leads WHERE row_leads.id = ' + lead_id, {
                type: db.sequelize.QueryTypes.SELECT
            }).catch((e) => {
                console.error(e);
            });
            
            return resolve(data[0])
        });
    }
}

module.exports = RowLeadsRepository;