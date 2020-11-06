const AutoDiallerService = require('../services/autodialler.service');

class AutoDiallerFacade {
    async getLeadIdFromCall(field, id){
        try{
            const leadId = await AutoDiallerService.getLeadIdFromCall(field, id);
            return { code: 201, status: "success", message: "Agent succesfull created", data: leadId };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new AutoDiallerFacade;