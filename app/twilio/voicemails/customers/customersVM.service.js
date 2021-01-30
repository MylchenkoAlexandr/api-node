const models = require("../../../../database/models");
const CustomersVMRepository = require("../../../repository/customersVM.repository")

class CustomersVMService {
    async create(lead_id, url) {
        try {
            if (lead_id && url) {
                const voiceMail = await models.CustomersVoiceMails.create({
                    lead_id: lead_id,
                    url: url
                });

                return await CustomersVMRepository.getOneById(voiceMail.id);
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CustomersVMService;