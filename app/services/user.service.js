const UserRepository = require('../repository/user.repository');

class UserService {
    async statusHandler(user_id, field, status) {
        try {
            const updated = await UserRepository.statusHandler(user_id, field, status);

            return updated;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @return users.id int
     */
    async findSuitableWorker(roleName, state_id) {
        try {
            const userId = await UserRepository.findSuitableWorker(roleName, state_id);

            return userId;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService; 