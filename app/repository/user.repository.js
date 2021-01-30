const db = require('../../database/models');
const _ = require('lodash');

class UserRepository {
    async getStatus(user_id, field) {
        try {
            const data = await db.sequelize.query(`SELECT users.${field} FROM users WHERE users.id = ${user_id}`, {
                type: db.sequelize.QueryTypes.SELECT
            }).catch(e => console.log("🚀 ~ file: user.repository.js ~ line 10 ~ UserRepository ~ getStatus ~ e", e));

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

        const data = await db.sequelize.query('SELECT users.id, users.phone FROM users INNER JOIN users_states ON users_states.user_id = users.id WHERE' + state + query + ' users.online = 1 AND users.in_call = 0;', {
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

}

module.exports = new UserRepository
