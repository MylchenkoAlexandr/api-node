class StatisticRepository {
    async getStatistic(role, filters) {
        try {
            const types = filters.types ? '' : '';
            const sources = filters.sources ? '' : '';
            const agents = filters.agents ? '' : '';

            const startEnd = () => {
                if (filters.start && filters.end) {
                    query = ' AND (l.createdAt BETWEEN ' + filters.start + ' AND ' + filters.end + ')';
                } else if (filters.end) {
                    query = ' AND l.createdAt > ' + filters.end;
                } else if (filters.start) {
                    query = ' AND l.createdAt < ' + filters.start;
                }
                return query;
            }

            const stat = await db.sequelize.query("SELECT CONCAT(u.fname, ' ', u.lname) agent, COUNT(l.user_id) c_a, (SELECT COUNT(l.id) FROM leads l WHERE l.user_id = u.id AND l.state_id IN (12, 13, 14, 15)) c_d, (SELECT COUNT(l.id) FROM leads l WHERE l.user_id = u.id AND l.state_id IN (14, 15))/COUNT(l.user_id) c_r FROM users u INNER JOIN leads l ON l.user_id = u.id WHERE u.role_id = 2 :types:sources:agents:start:end GROUP BY u.fname ORDER BY u.fname", {
                replacements: {
                    types: types,
                    sources: sources,
                    agents: agents,
                    startEnd: startEnd(),
                },
                type: db.sequelize.QueryTypes.SELECT
            });;

            return stat;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StatisticRepository();