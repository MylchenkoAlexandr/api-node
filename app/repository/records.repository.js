const db = require('../../database/models');

const RecordsRepository = {
    getAll(lead_id) {
        return new Promise(async (resolve, reject) => {
            let data = await db.sequelize.query(`SELECT CONCAT(users.fname, ' ' , users.lname) as fullname, records.createdAt, records.url, records.transcription_text AS text FROM records INNER JOIN users ON records.user_id = users.id WHERE lead_id = ${lead_id}`, {
                type: db.sequelize.QueryTypes.SELECT
            }).catch((e) => {
                console.error(e);
            });

            return resolve(data);
        });
    },
    getOne(id){
        return new Promise(async (resolve, reject) => {
            let data = await db.sequelize.query(`SELECT CONCAT(users.fname, ' ' , users.lname) as fullname, records.createdAt, records.url, records.transcription_text AS text  FROM records INNER JOIN users ON records.user_id = users.id WHERE records.id = ${id}`, {
                type: db.sequelize.QueryTypes.SELECT
            }).catch((e) => {
                console.error(e);
            });

            return resolve(data[0]);
        });
    }
}

module.exports = RecordsRepository