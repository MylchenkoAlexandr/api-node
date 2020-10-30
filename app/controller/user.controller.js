const UserService = require("../services/user.service");

class UserController {
    async active(req, res){
        await UserService.active(req.body.user_id, req.body.status);
    }
}


module.exports = new UserController;