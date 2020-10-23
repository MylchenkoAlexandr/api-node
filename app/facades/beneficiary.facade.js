const BeneficiaryService = require('../services/beneficiary.service');

class BeneficiaryFacade {
    async save(beneficiary_options, beneficiary_number) {
        try {
            const beneficiary = await BeneficiaryService.getOne(beneficiary_options.lead_id, beneficiary_number);
            const availablePercent = await BeneficiaryService.getAvailablePercent(beneficiary_options.lead_id, beneficiary_number);

            if (Number(beneficiary_options.percent) > Number(availablePercent)) return { code: 400, status: 'error', message: `You have available ${availablePercent}%` };

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

    async getAutoProcent(lead_id, beneficiary_number) {
        try {
            const auto_percent = await BeneficiaryService.getAvailablePercent(lead_id, beneficiary_number);

            if (auto_percent <= 0) return { code: 400, status: 'error', message: `You have available ${auto_percent}%` };

            return { code: 200, status: 'success', message: 'Auto percent complete', percent: auto_percent };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BeneficiaryFacade;