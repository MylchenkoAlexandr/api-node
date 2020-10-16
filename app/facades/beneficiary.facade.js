const BeneficiaryService = require('../services/beneficiary.service');

class BeneficiaryFacade {
    async save(beneficiary_options, beneficiary_number) {
        try {
            const beneficiary = await BeneficiaryService.getOne(beneficiary_options.lead_id, beneficiary_number);

            if (beneficiary) {
                await BeneficiaryService.update(beneficiary_options, beneficiary);
                return { code: 200, status: 'success', message: 'Beneficiary updated!' };
            }

            await BeneficiaryService.create(beneficiary_options, beneficiary_number);
            return { code: 201, status: 'success', message: 'Beneficiary created!' };
        } catch (error) {
            throw error;
        }
    }

    async getAll(lead_id) {
        try {
            const beneficiaries = await BeneficiaryService.getAll(lead_id);

            return { code: 200, status: 'success', beneficiaries };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BeneficiaryFacade;