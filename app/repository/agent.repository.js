const db = require('../../database/models');

const AgentRepository = {
    async getAgentWithSmallestCountLeads(state_id) {
        try {
            const data = await db.sequelize.query("SELECT users.id, COUNT(leads.id) AS `count` FROM users INNER JOIN users_states ON users_states.user_id = users.id LEFT JOIN leads ON leads.user_id = users.id WHERE users_states.state_id = '" + state_id + "' GROUP BY users.id ORDER BY `count` ASC LIMIT 1", {
                type: db.sequelize.QueryTypes.SELECT,
            });

            console.log("getAgentWithSmallestCountLeads -> data[0].id", data[0].id)

            if (data[0]) {
                return data[0].id;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AgentRepository;