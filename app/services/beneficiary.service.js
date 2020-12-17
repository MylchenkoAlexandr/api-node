const models = require('../../database/models');
const BeneficiaryRepository = require('../repository/beneficiary.repository');

class BeneficiaryService {

    async create(beneficiary_options, beneficiary_number) {
        try {
            const state = await models.States.findOne({
                attributes: ["id"],
                where: { name: beneficiary_options.location }
            });
            await models.Beneficiaries.create({
                lead_id: beneficiary_options.lead_id,
                name: beneficiary_options.name,
                dob: beneficiary_options.dob,
                number: beneficiary_number,
                relative_id: beneficiary_options.relative_id,
                location_id: state.id,
                grand_kids: beneficiary_options.grand_kids,
                work_status: beneficiary_options.work_status,
                percent: beneficiary_options.percent
            });
        } catch (error) {
            throw error;
        }
    }

    async update(beneficiary_options, beneficiary) {
        try {
            const state = await models.States.findOne({
                attributes: ["id"],
                where: { name: beneficiary_options.location }
            });

            await beneficiary.update({
                name: beneficiary_options.name,
                dob: beneficiary_options.dob,
                relative_id: beneficiary_options.relative_id,
                location_id: state.id,
                grand_kids: beneficiary_options.grand_kids,
                work_status: beneficiary_options.work_status,
                percent: beneficiary_options.percent
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for read beneficiary
     * @param {number} beneficiary_id
     */
    async getOne(lead_id, beneficiary_number) {
        try {
            const beneficiary = await models.Beneficiaries.findOne({ where: { lead_id: lead_id, number: beneficiary_number } });
            return beneficiary;
        } catch (error) {
            throw error;
        }
    }

    async getAll(lead_id) {
        try {
            const beneficiaries = await BeneficiaryRepository.getAll(lead_id);
            return beneficiaries;
        } catch (error) {
            throw error;
        }
    }

    async getAvailablePercent(lead_id, beneficiary_number = null) {
        try {
            let availablePercent = 100;
            let percents = [];

            if (beneficiary_number) percents = await BeneficiaryRepository.getAllPercentsByLeadExceptBeneficiaryNumber(lead_id, beneficiary_number);
            else percents = await BeneficiaryRepository.getAllPercentsByLeadId(lead_id);

            percents.forEach(item => availablePercent -= item.percent);

            return availablePercent;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BeneficiaryService;