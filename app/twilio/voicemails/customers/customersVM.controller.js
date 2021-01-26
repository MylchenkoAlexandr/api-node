const CustomersVMRepository = require('../../../repository/customersVM.repository');

class CustomersVMController {
    async get(req, res) {
        try {
            if ("lead_id" in req.params) {
                const voiceMails = await CustomersVMRepository.getAllByLeadId(req.params.lead_id);
                if (voiceMails) {
                    return res.status(200).send({ status: "success", message: "Success!", vm: voiceMails });
                }
            }
            return res.status(400).send({ status: "error", message: "Bad request!" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }
}

module.exports = new CustomersVMController;
