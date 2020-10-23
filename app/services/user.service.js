const models = require('../../database/models');


class UserService {
    async active(user_id, active) {
        const user = await models.users.findOne({
            where: {
                id: user_id
            }
        });

        await user.update({
            active: active
        });
    }

    async findSuitableWorker(roleName) {
        const role = await models.roles.findOne({
            attributes: ['id'],
            where: {
                name: roleName
            }
        });

        const users = models.users.findOne({
            attributes: ['id'],
            where: {
                role_id: role.id,
                active: 1,
                in_call: 0
            }
        });

        return users.id;
    }
}

module.exports = new UserService; 