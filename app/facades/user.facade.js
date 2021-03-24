const UserService = require("../services/user.service");

class UserFacade {
    async getStatus(user_id, field) {
        try {
            const status = await UserService.getStatus(user_id, field);
            
            return { code: 200, status: status };
        } catch (error) {
            throw error;
        }
    }
    async statusHandler(user_id, field, status) {
        try {
            const updateStatus = await UserService.statusHandler(user_id, field, status);

            if (updateStatus != -1) return { code: 200, status: "success", message: "Status changed" };

            return { code: 404, status: "error", message: "Unexpected error" };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new UserFacade;