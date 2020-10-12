const BeneficiaryService = require('../services/beneficiary.service');

class BeneficiaryFacade {
    async save(beneficiary_options) {
        try {
            const beneficiary = await BeneficiaryService.getOne(beneficiary_options.lead_id);

            if (beneficiary) {
                await BeneficiaryService.update(beneficiary_options);
                return { code: 200, status: 'success', message: 'Beneficiary updated!' };
            }

            await BeneficiaryService.create(beneficiary_options);
            return { code: 201, status: 'success', message: 'Beneficiary created!' };
        } catch (error) {
            throw error;
        }
    }

    async getOne(lead_id) {
        try {
            const beneficiary = await BeneficiaryService.getOne(lead_id);

            return { code: 200, status: 'success', beneficiary };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BeneficiaryFacade;