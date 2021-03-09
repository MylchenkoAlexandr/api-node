const db = require('../../database/models');

class StatisticRepository {
    async getStatistic(user_id, filters) {
        try {
            let typeQuery = ' AND l.type_id = 0 ';
            let sourcesQuery = ' AND l.source_id = 0 ';
            let agentsQuery = ' AND u.id = 0 ';

            if (filters.types.length) {
                typeQuery = ' AND l.type_id = ' + filters.types.join(' OR l.type_id = ');
            }

            if (filters.sources.length) {
                sourcesQuery = ' AND l.source_id = ' + filters.sources.join(' OR l.source_id = ');
            }

            if (filters.agents.length) {
                agentsQuery = ' AND u.id = ' + filters.agents.join(' OR u.id = ');
            }

            const startEnd = () => {
                // if (filters.start && filters.end) {
                //     query = ' AND ( l.createdAt BETWEEN ' + filters.start + ' AND ' + filters.end + ' )';
                // } else if (filters.end) {
                //     query = ' AND l.createdAt > ' + filters.end;
                // } else if (filters.start) {
                //     query = ' AND l.createdAt < ' + filters.start;
                // }
                return "";
            }

            const statInfo = await db.sequelize.query(`SELECT CONCAT(u.fname, ' ', u.lname) agent, COUNT(l.user_id) c_a, (SELECT COUNT(l.id) FROM leads l WHERE l.user_id = u.id AND l.status_id IN (12, 13, 14, 15)) c_d, (SELECT COUNT(l.id) FROM leads l WHERE l.user_id = u.id AND l.status_id IN (12, 13, 14, 15))/COUNT(l.user_id)*100 c_r FROM users u INNER JOIN leads l ON l.user_id = u.id WHERE u.role_id = 2 ${agentsQuery} GROUP BY u.fname ORDER BY u.fname`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            console.log(statInfo)


            // return statInfo;
            return "";
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StatisticRepository();