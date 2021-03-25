const StatisticRepository = require("../repository/statistic.repository.js");
class StatisticService {
    async getStatistic(filters){
        try{
            return await StatisticRepository.getStatistic(filters);
        }catch(error){
            throw error;
        }
    }
}

module.exports = new StatisticService();