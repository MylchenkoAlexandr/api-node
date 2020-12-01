const userRepository = require('../repository/user.repository');
const UserRepository = require('../repository/user.repository');

class UserService {
    async getStatus(user_id, field){
        try {
            const status = await UserRepository.getStatus(user_id, field);            
            return status;
        } catch (error) {
            throw error;
        }
    }

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