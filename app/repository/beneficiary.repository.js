const db = require('../../database/models');

const BeneficiaryRepository = {
    async getOne(lead_id) {
        const data = await db.sequelize.query('SELECT beneficiaries.name, beneficiaries.dob, beneficiaries.relative_id, beneficiaries.grand_kids, beneficiaries.work_status, states.name as location FROM beneficiaries LEFT JOIN states ON beneficiaries.location_id = states.id WHERE beneficiaries.lead_id = ' + lead_id, {
            type: db.sequelize.QueryTypes.SELECT,
        }).catch(e => {
            throw e;
        });

        return data[0];
    }
}

module.exports = BeneficiaryRepository;