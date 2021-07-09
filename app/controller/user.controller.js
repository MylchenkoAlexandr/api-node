const UserFacade = require("../facades/user.facade");
const UserRepository = require("../repository/user.repository");
const UserService = require("../services/user.service");

class UserController {
    async getStatus(req, res) {
        try {
            if ("user_id" in req.body && "field" in req.body) {
                const responce = await UserFacade.getStatus(req.body.user_id, req.body.field);

                return res.status(responce.code).json({ status: responce.status });
            }

            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

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

    async updateColumns(req, res) {
        try {
            if ("id" in req.body && "fields" in req.body) {
                const response = await UserService.updateColumns(req.body.id, req.body.fields);
                return res.status(response.code).json({ status: response.status, message: response.message });
            }

            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }
}


module.exports = new UserController;