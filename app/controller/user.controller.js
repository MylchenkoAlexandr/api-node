const UserFacade = require("../facades/user.facade");
class UserController {
    async changeStatus(req, res) {
        try {
            if ("user_id" in req.body && "field" in req.body && "status" in req.body) {
                const response = await UserFacade.statusHandler(req.body.user_id, req.body.field, req.body.status);
                
                return res.status(response.code).json({ status: response.status, message: response.message });
            }
            
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw err;
        }
    }
}


module.exports = new UserController;