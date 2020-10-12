const models = require('../../database/models');
const BeneficiaryRepository = require('../repository/beneficiary.repository');

class BeneficiaryService {

    async create(beneficiary_options) {
        try {
            const state = await models.States.findOne({
                attributes: ["id"],
                where: { name: beneficiary_options.location }
            });
            await models.Beneficiaries.create({
                lead_id: beneficiary_options.lead_id,
                name: beneficiary_options.name,
                dob: beneficiary_options.dob,
                relative_id: beneficiary_options.relative_id,
                location_id: state.id,
                grand_kids: beneficiary_options.grand_kids,
                work_status: beneficiary_options.work_status
            });
        } catch (error) {
            throw error;
        }
    }

    async update(beneficiary_options) {
        try {
            const state = await models.States.findOne({
                attributes: ["id"],
                where: { name: beneficiary_options.location }
            });
            await models.Beneficiaries.update({
                name: beneficiary_options.name,
                dob: beneficiary_options.dob,
                relative_id: beneficiary_options.relative_id,
                location_id: state.id,
                grand_kids: beneficiary_options.grand_kids,
                work_status: beneficiary_options.work_status
            }, { where: { lead_id: beneficiary_options.lead_id } });
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for get beneficiary for the one lead
     * @param {number} lead_id
     */
    async getOne(lead_id) {
        try {
            const beneficiary = await BeneficiaryRepository.getOne(lead_id);

            return beneficiary;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BeneficiaryService;