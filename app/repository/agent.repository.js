const db = require('../../database/models');

const AgentRepository = {
    async getAgentWithSmallestCountLeads(state_id) {
        const data = await db.sequelize.query("SELECT leads.user_id, COUNT(leads.id) AS `count` FROM leads INNER JOIN users_states ON users_states.user_id = leads.user_id WHERE leads.state_id = '" + state_id + "' AND users_states.state_id = leads.state_id GROUP BY leads.user_id ORDER BY `count` ASC LIMIT 1", {
            type: db.sequelize.QueryTypes.SELECT,
        }).catch(e => {
            throw e;
        });

        return data[0].user_id;
    }
}

module.exports = AgentRepository;