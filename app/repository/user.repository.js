const db = require('../../database/models');

class UserRepository {
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

    async findSuitableWorker(roleName) {
        const data = await db.sequelize.query(`SELECT users.id FROM users WHERE users.role_id = (SELECT roles.id FROM roles WHERE roles.name = '${roleName}') AND users.active = 1 AND users.in_call = 0`, {
            type: db.sequelize.QueryTypes.SELECT,
        }).catch(e => {
            throw e;
        });
        
        return data[0].id;
    }
}

module.exports = new UserRepository
