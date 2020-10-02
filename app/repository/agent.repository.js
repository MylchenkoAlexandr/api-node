const db = require('../../database/models');

const AgentRepository = {
    /**
     * Find agent with smallest 
     * @param {number} state_id 
     */
    async getAgentWithSmallestCountLeads(state_id) {
        try {
            const data = await db.sequelize.query("SELECT users.id, COUNT(leads.id) AS `count` FROM users INNER JOIN users_states ON users_states.user_id = users.id LEFT JOIN leads ON leads.user_id = users.id WHERE users_states.state_id = '" + state_id + "' AND users.not_assign = 0 GROUP BY users.id ORDER BY `count` ASC LIMIT 1", {
                type: db.sequelize.QueryTypes.SELECT,
            });

            if (data[0]) {
                return data[0].id;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Find role
     * @param {number} user_id 
     */
    async getRole(user_id) {
        try {
            const data = await db.sequelize.query("SELECT roles.name AS role FROM users INNER JOIN roles ON roles.id = users.role_id WHERE users.id = " + user_id, {
                type: db.sequelize.QueryTypes.SELECT,
            });

            if (data[0]) {
                return data[0].role
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Find an agent by state
     * @param {number} state_id 
     */
    async getAgentByState(state_id) {
        try {
            const data = await db.sequelize.query("SELECT users.email, users.id FROM users INNER JOIN users_states ON users_states.user_id = users.id WHERE users_states.state_id = " + state_id + " AND users.not_assign = 0", {
                type: db.sequelize.QueryTypes.SELECT
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    async getUncompeletedLead(email) {
        try {
            const data = await db.sequelize.query(`SELECT users.uncompleted_lead as lead_id FROM users WHERE users.email = "${email}"`, {
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });

            return data.lead_id;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AgentRepository;