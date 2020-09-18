const BeneficiaryService = require('../services/beneficiary.service');

async function saveBeneficiary(req, res) {
    const beneficiary_options = req.body;

    try {
        const response = await BeneficiaryService.save(beneficiary_options);

        res.status(response.code).json({
            status: response.status,
            message: response.message
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Server error"
        });
        throw error;
    }
}

async function getBeneficiary(req, res) {
    try {
        const response = await BeneficiaryService.getOne(req.params.lead_id);

        res.status(response.code).json({
            status: response.status,
            message: response.message,
            beneficiary: response.beneficiary
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Server error"
        });
        throw error;
    }
}

module.exports = {
    saveBeneficiary,
    getBeneficiary
}