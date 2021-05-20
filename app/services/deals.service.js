const DealsRepository = require("../repository/deals.repository.js");

class DealsService {
    async getDeals(filters){
        try{
            return await DealsRepository.getDeals(filters);
        }catch(error){
            throw error;
        }
    }
}

module.exports = new DealsService();