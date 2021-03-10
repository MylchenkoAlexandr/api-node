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

    async findSuitableAgent(id = null, state_id = null) {
        let query = ' ';
        let state = ' ';

        if (id) {
            query = ' users.id = ' + id + ' AND ';
        }

        if (state_id) {
            state = " users_states.state_id = '" + state_id + "' AND ";
        }

        const data = await db.sequelize.query('SELECT users.id FROM users INNER JOIN users_states ON users_states.user_id = users.id WHERE' + state + query + ' users.online = 1 AND users.in_call = 0;', {
            type: db.sequelize.QueryTypes.SELECT,
        }).catch(e => {
            throw e;
        });

        return _.isEmpty(data) ? false : data[0];
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

    // async findSuitableAgentByCountOfBlueberryLeads(state_id) {
    //     const currentDate = new Date().toISOString().slice(0, 10);
    //     const start = currentDate + ' ' + '00:00:00';
    //     const end = currentDate + ' ' + '23:59:59';

    //     const data = await db.sequelize.query("SELECT users.id,(SELECT COUNT(leads.id) FROM leads WHERE leads.user_id = users.id AND leads.source_id != 12 AND leads.status_id = 12 OR leads.status_id = 13 OR leads.status_id = 14 AND leads.createdAt BETWEEN :start AND :end) AS `count` FROM users INNER JOIN users_states ON users_states.user_id = users.id WHERE users_states.state_id = :state_id AND users.in_call = 0 AND users.online = 1 GROUP BY users.id ORDER BY `count` DESC LIMIT 1", {
    //         replacements: { state_id: state_id, start: start, end: end },
    //         type: db.sequelize.QueryTypes.SELECT,
    //         plain: true,
    //     }).catch(e => { throw e })

    //     return data;
    // }

    async findSuitableAgentByCountOfBlueberryLeads(state_id) {
        // Last 7 days start and end datetime
        const sT = '00:00:00';
        const eT = '23:59:59';
        const l7d = new Date();
        l7d.setDate(l7d.getDate() - 7);
        const l7dStart = `${l7d.toISOString().slice(0, 10)} ${st}`;
        const l7dEnd = `${new Date().toISOString().slice(0, 10)} ${et}`;

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
            let count = await db.sequelize.query("SELECT users.id, (SELECT COUNT(leads.id) FROM leads WHERE leads.user_id = users.id AND leads.source_id = 1 AND leads.status_id = 15 OR leads.status_id = 16 OR leads.status_id = 17 OR leads.status_id = 18 OR leads.status_id = 19 OR leads.status_id = 20 OR leads.status_id = 21 OR leads.status_id = 22 AND leads.createdAt BETWEEN :start AND :end ) AS `count` FROM users WHERE users.in_call = 0 AND users.online = 1 AND users.id = :user_id ORDER BY users.id", {
                replacements: { user_id: agent.id, start: l7dStart, end: l7dEnd },
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            }).catch(e => { throw e });

            agents.push({ ...agent, l7d: count.count });

        }
        agents.sort((a, b) => (a.l7d < b.l7d) ? 1 : -1);

        if (agents[0]) {
            agents[0].count -= 2;
        }

        if (agents[1]) {
            agents[1].count -= 1;
        }

        return agents[0];
        d
    }
}

module.exports = new UserRepository
