const BeneficiaryFacade = require('../facades/beneficiary.facade');

async function saveBeneficiary(req, res) {

    try {
        if (
            ("lead_id" in req.body)
            && ("name" in req.body)
            && ("dob" in req.body)
            && ('relative_id' in req.body)
            && ("location" in req.body)
            && ("grand_kids" in req.body)
            && ("work_status" in req.body)
            && ("procent" in req.body)
        ) {
            const beneficiary_options = {
                lead_id: req.body.lead_id,
                name: req.body.name,
                dob: req.body.dob,
                relative_id: req.body.relative_id,
                location: req.body.location,
                grand_kids: req.body.grand_kids,
                work_status: req.body.work_status,
                procent: req.body.procent
            };

            const response = await BeneficiaryFacade.save(beneficiary_options, +req.params.beneficiary_number);

            return res.status(response.code).json({ status: response.status, message: response.message });
        }

        return res.status(400).json({ status: "error", message: "Bad request" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error" });
        throw error;
    }
}

async function getBeneficiaries(req, res) {
    try {
        const response = await BeneficiaryFacade.getAll(req.params.lead_id);

        return res.status(response.code).json({ status: response.status, beneficiaries: response.beneficiaries });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error" });
        throw error;
    }
}

module.exports = {
    saveBeneficiary,
    getBeneficiaries
}