const db = require('../../database/models');

class StatisticRepository {
    async getStatistic(filters) {
        try {
            let typeQuery = filters.types.length ? ' AND l.type_id IN (' + filters.types.join(', ') + ')' : " AND l.type_id = 0 ";
            let sourcesQuery = filters.sources.length ? ' AND l.source_id IN (' + filters.sources.join(', ') + ')' : " AND l.source_id = 0 ";
            let agentsQuery = filters.agents.length ? ' AND u.id IN (' + filters.agents.join(', ') + ')' : " AND l.id = 0 ";

            const startEnd = () => {
                let query = '';

                if (filters.date.length == 2) {
                    filters.date.sort();
                    let start = filters.date[0] + ' ' + '00:00:00';
                    let end = filters.date[1] + ' ' + '23:59:59';

                    query = " AND ( l.createdAt BETWEEN '" + start + "' AND '" + end + "')";
                }

                return query;
            }

            const statInfo = await db.sequelize.query(`SELECT CONCAT(u.fname, ' ', u.lname) agent, COUNT(l.id) c_a, (SELECT COUNT(l.id) FROM leads l WHERE l.user_id = u.id AND l.status_id IN (20, 21, 22, 15, 16)${sourcesQuery}${typeQuery}${startEnd()}) c_d, (SELECT COUNT(l.id) FROM leads l WHERE l.user_id = u.id AND l.status_id IN (20, 21, 22, 15, 16)${sourcesQuery}${typeQuery}${startEnd()})/COUNT(l.id)*100 c_r  FROM users u INNER JOIN leads l ON l.user_id = u.id WHERE u.role_id = 2${agentsQuery}${sourcesQuery}${typeQuery}${startEnd()} GROUP BY u.fname ORDER BY u.fname`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            statInfo.forEach(item => {
                item.c_r = `${parseInt(item.c_r)}%`
            });

            return statInfo;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StatisticRepository();