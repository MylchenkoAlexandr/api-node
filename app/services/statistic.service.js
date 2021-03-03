const StatisticRepository = require("../repository/statistic.repository.js");
class StatisticService {
    async getStatistic(role, filters){
        try{
            return await StatisticRepository.getStatistic(role, filters);
        }catch(error){
            throw error;
        }
    }
}

module.exports = new StatisticService();