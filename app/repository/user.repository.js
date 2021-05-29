const db = require('../../database/models');
const _ = require('lodash');

class UserRepository {
    async getStatus(user_id, field) {
        try {
            const data = await db.sequelize.query(`SELECT users.${field} FROM users WHERE users.id = ${user_id}`, {
                type: db.sequelize.QueryTypes.SELECT
            }).catch(e => console.log(e));

            return data[0][field];
        } catch (error) {
            throw error;
        }
    }


    async statusHandler(user_id, field, status) {
        try {
            const data = await db.sequelize.query(`UPDATE users SET users.${field} = ${status} WHERE users.id = ${user_id}`, {
                type: db.sequelize.QueryTypes.UPDATE,
            });

            return data[1];
        } catch (err) {
            throw err;
        }

    }

    async findSuitableWorker(roleName, state_id = null, id = null) {
        let query = `SELECT users.id FROM users WHERE users.role_id = (SELECT roles.id FROM roles WHERE roles.name = '${roleName}') AND users.active = 1 AND users.in_call = 0`;

        if (roleName == 'agent' && state_id) {
            query = "SELECT users.id, COUNT(leads.id) AS `count` FROM users INNER JOIN users_states ON users_states.user_id = users.id LEFT JOIN leads ON leads.user_id = users.id WHERE users_states.state_id = '" + state_id + "' AND users.not_assign = 0 AND users.active = 1 AND users.in_call = 0 GROUP BY users.id ORDER BY `count` ASC LIMIT 1"
        }

        if (id) {
            query = `SELECT users.id FROM users WHERE users.id = ${id} AND users.active = 1 AND users.in_call = 0`;
        }

        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        }).catch(e => {
            throw e;
        });

        return _.isEmpty(data) ? false : data[0].id;
    }

    async findSuitableAgent(id) {
        const data = await db.sequelize.query('SELECT u.id FROM users u WHERE u.id = :id AND u.online = 1 AND u.in_call = 0;', {
            replacements: {
                id: id
            },
            type: db.sequelize.QueryTypes.SELECT,
            plain: true
        }).catch(e => {
            throw e;
        });

        return data ? data : false;
    }

    async findSuitableAgentByState(state_id) {
        const data = await db.sequelize.query('SELECT users.id, users.phone FROM users INNER JOIN users_states ON users_states.user_id = users.id WHERE users_states.state_id = :state_id', {
            replacements: { state_id: state_id },
            type: db.sequelize.QueryTypes.SELECT,
            plain: true
        }).catch(e => {
            throw e;
        });

        return _.isEmpty(data) ? false : data;
    }

    async findSuitableAgentByCountOfBlueberryLeads(state_id) {
        // Last 7 days start and end datetime
        const sT = '00:00:00';
        const eT = '23:59:59';
        const l7d = new Date();
        l7d.setDate(l7d.getDate() - 7);
        const l7dStart = `${l7d.toISOString().slice(0, 10)} ${sT}`;
        const l7dEnd = `${new Date().toISOString().slice(0, 10)} ${eT}`;

        // Current date start and end datetime
        const cd = new Date().toISOString().slice(0, 10);
        const cdStart = `${cd} ${sT}`;
        const cdEnd = `${cd} ${eT}`;

        let agentsList = await db.sequelize.query("SELECT users.id,(SELECT COUNT(leads.id) FROM leads WHERE leads.user_id = users.id AND leads.source_id = 1 AND leads.createdAt BETWEEN :start AND :end) AS `count` FROM users INNER JOIN users_states ON users_states.user_id = users.id WHERE users_states.state_id = :state_id AND users.in_call = 0 AND users.online = 1 GROUP BY users.id ORDER BY `count` ASC", {
            replacements: { state_id: state_id, start: cdStart, end: cdEnd },
            type: db.sequelize.QueryTypes.SELECT,
        }).catch(e => { throw e });

        let agents = [];

        for (const [index, agent] of Object.entries(agentsList)) {
            let count = await db.sequelize.query("SELECT users.id, (SELECT COUNT(leads.id) FROM leads WHERE leads.user_id = users.id AND leads.source_id = 1 AND leads.status_id IN (15, 16, 17, 18, 19, 20, 21, 22) AND leads.createdAt BETWEEN :start AND :end ) AS `count` FROM users WHERE users.in_call = 0 AND users.online = 1 AND users.id = :user_id ORDER BY users.id", {
                replacements: { user_id: agent.id, start: l7dStart, end: l7dEnd },
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            }).catch(e => { throw e });

            agents.push({ ...agent, l7d: count.count });
        }

        agents.sort((a, b) => (a.l7d < b.l7d) ? 1 : -1);

        if (agents[0]) {
            if (agents[0].l7d > 0) {
                agents[0].count -= 1;
            }  
        }

        agents.sort((a, b) => (a.count > b.count) ? 1 : -1);

        return agents[0];
    }

    // async findSuitableAgentByCountOfBlueberryLeads(state_id, type = 1) {
    //     // Last 7 days start and end datetime
    //     const sT = '00:00:00';
    //     const eT = '23:59:59';
    //     const l7d = new Date();
    //     l7d.setDate(l7d.getDate() - 7);
    //     const l7dStart = `${l7d.toISOString().slice(0, 10)} ${sT}`;
    //     const l7dEnd = `${new Date().toISOString().slice(0, 10)} ${eT}`;

    //     // Current date start and end datetime
    //     const cd = new Date().toISOString().slice(0, 10);
    //     const cdStart = `${cd} ${sT}`;
    //     const cdEnd = `${cd} ${eT}`;

    //     let leadType = 2;

    //     if (type == 2) {
    //         leadType = 4;
    //     }

    //     let agents = await db.sequelize.query("SELECT users.id, (SELECT COUNT(leads.id) FROM leads WHERE leads.user_id = users.id AND leads.source_id = 1 AND leads.type_id = :leadType AND leads.createdAt BETWEEN :start AND :end) `count`, (SELECT COUNT(leads.id) FROM leads WHERE leads.user_id = users.id AND leads.source_id = 1 AND leads.status_id IN (15, 16, 17, 18, 19, 20, 21, 22) AND leads.type_id = :leadType AND leads.createdAt BETWEEN :startl7d AND :endl7d ) `l7d` FROM users INNER JOIN users_states ON users_states.user_id = users.id INNER JOIN users_subroles u_s ON u_s.user_id = users.id WHERE users_states.state_id = :state_id AND users.in_call = 0 AND users.online = 1 AND u_s.subrole_id = :subrole GROUP BY users.id ORDER BY l7d DESC", {
    //         replacements: { leadType: leadType, state_id: state_id, start: cdStart, end: cdEnd, startl7d: l7dStart, endl7d: l7dEnd, subrole: type },
    //         type: db.sequelize.QueryTypes.SELECT,
    //         logging: console.log,
    //     }).catch(e => { throw e });

    //     if (agents[0] && agents[0].l7d > 0) {
    //         agents[0].count -= 1;
    //     }

    //     agents.sort((a, b) => (a.count > b.count) ? 1 : -1);
    //     console.log(agents);
    //     return agents[0];
    // }

    /**
     * 
     * @param {Array} states[]
     */
    async findSuitableAgentsByStates(states) {
        if (states) {
            let agents = await db.sequelize.query("SELECT u.id, CONCAT(u.fname, ' ', u.lname) title FROM users u INNER JOIN users_states us ON us.user_id = u.id WHERE us.state_id IN (:states) AND u.role_id = 2 AND u.banned = 0 AND u.not_assign = 0", {
                replacements: { states: states },
                type: db.sequelize.QueryTypes.SELECT,
            }).catch(e => { throw e });
            agents.unshift({ id: null, title: "Without agent" })
            return agents;
        }

        return [{ id: null, title: "Without agent" }]
    }
}

module.exports = new UserRepository
