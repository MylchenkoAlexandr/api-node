const StatisticRepository = require("../repository/statistic.repository.js");
class StatisticService {
    async getStatistic(user_id, filters){
        try{
            return await StatisticRepository.getStatistic(user_id, filters);
        }catch(error){
            throw error;
        }
    }
}

module.exports = new StatisticService();