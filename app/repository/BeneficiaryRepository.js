const db = require('../../database/models');

const BeneficiaryRepository = {
    getOne(lead_id) {
        return new Promise(async (resolve, reject) => {
            const data = await db.sequelize.query('SELECT beneficiaries.name, beneficiaries.relative_id, beneficiaries.grand_kids, beneficiaries.work_status, states.name as location FROM beneficiaries LEFT JOIN states ON beneficiaries.location_id = states.id WHERE beneficiaries.lead_id = ' + lead_id, {
                type: db.sequelize.QueryTypes.SELECT,
            }).catch(e => {
                console.error(e);
            });

            if (data) {
                return resolve(data[0]);
            }
        });
    }
}

module.exports = BeneficiaryRepository;