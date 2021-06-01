const BeneficiaryFacade = require('../facades/beneficiary.facade');

class BeneficiaryController {
    async saveBeneficiary(req, res) {

        try {
            if (("name" in req.body)
                && ("dob" in req.body)
                && ('relative_id' in req.body)
                && ("location" in req.body)
                && ("grand_kids" in req.body)
                && ("work_status" in req.body)
                && ("percent" in req.body)
            ) {
                const beneficiary_options = {
                    lead_id: req.params.lead_id,
                    name: req.body.name,
                    dob: req.body.dob,
                    relative_id: req.body.relative_id,
                    location: req.body.location,
                    grand_kids: req.body.grand_kids,
                    work_status: req.body.work_status,
                    percent: req.body.percent
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

    async getBeneficiaries(req, res) {
        try {
            const response = await BeneficiaryFacade.getAll(req.params.lead_id);

            return res.status(response.code).json({ status: response.status, beneficiaries: response.beneficiaries });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server error" });
            throw error;
        }
    }

    async getAutoProcent(req, res) {
        try {
            const response = await BeneficiaryFacade.getAutoProcent(req.params.lead_id, req.params.beneficiary_number);

            return res.status(response.code).json({ status: response.status, message: response.message, percent: response.percent });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server error" });
            throw error;
        }
    }
}


module.exports = new BeneficiaryController;