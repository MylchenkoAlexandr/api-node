const db = require('../../database/models');

const RecordsRepository = {
    getAll(lead_id) {
        return new Promise(async (resolve, reject) => {
            let data = await db.sequelize.query(`SELECT CONCAT(users.fname, ' ' , users.lname) as fullname, records.createdAt, records.url FROM records INNER JOIN users ON records.user_id = users.id WHERE lead_id = ${lead_id}`, {
                type: db.sequelize.QueryTypes.SELECT
            }).catch((e) => {
                console.error(e);
            });

            return resolve(data);
        });
    }
}

module.exports = RecordsRepository