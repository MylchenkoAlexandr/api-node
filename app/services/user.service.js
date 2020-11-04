const models = require('../../database/models');
const UserRepository = require('../repository/user.repository');

class UserService {
    async statusHandler (user_id, field, status) {
        const updated = await UserRepository.statusHandler(user_id, field, status);

        return updated;
    }
 
    /**
     * 
     * @return users.id int
     */
    async findSuitableWorker(roleName) {
        const userId = await UserRepository.findSuitableWorker(roleName);

        return userId;
    }
}

module.exports = new UserService; 