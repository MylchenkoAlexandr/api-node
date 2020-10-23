const db = require('../../database/models');

const BeneficiaryRepository = {
    async getOne(lead_id, beneficiary_number) {
        try {
            const data = await db.sequelize.query(`SELECT beneficiaries.name, beneficiaries.dob, beneficiaries.relative_id, beneficiaries.grand_kids, beneficiaries.work_status, beneficiaries.percent, states.name as location FROM beneficiaries LEFT JOIN states ON beneficiaries.location_id = states.id WHERE beneficiaries.lead_id = ${lead_id} AND beneficiaries.number = ${beneficiary_number}`, {
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });
    
            return data;
        } catch (error) {
            throw error;
        }
    },

    async getAll(lead_id) {
        try {
            const data = await db.sequelize.query(`SELECT beneficiaries.id, beneficiaries.name, beneficiaries.dob, beneficiaries.relative_id, beneficiaries.grand_kids, beneficiaries.work_status, beneficiaries.percent, states.name as location FROM beneficiaries LEFT JOIN states ON beneficiaries.location_id = states.id WHERE beneficiaries.lead_id = ${lead_id}`, { type: db.sequelize.QueryTypes.SELECT });

            return data;
        } catch (error) {
            throw error;
        }
    },

    async getAllPercentsByLeadId(lead_id) {
        try {
            const data = await db.sequelize.query(`SELECT beneficiaries.percent FROM beneficiaries WHERE beneficiaries.lead_id = ${lead_id}`, { type: db.sequelize.QueryTypes.SELECT });

            return data;
        } catch (error) {
            throw error;
        }
    },

    async getAllPercentsByLeadExceptBeneficiaryNumber(lead_id, beneficiary_number) {
        try {
            const data = await db.sequelize.query(`SELECT beneficiaries.percent FROM beneficiaries WHERE beneficiaries.lead_id = ${lead_id} AND beneficiaries.number != ${beneficiary_number}`, { type: db.sequelize.QueryTypes.SELECT });

            return data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BeneficiaryRepository;