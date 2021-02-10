const models = require("../../database/models");
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);

class FollowUpController {
    async get(req, res) {
        try {
            if ("lead_id" in req.params) {
                const followups = await models.Followups.findAll({
                    where: {
                        lead_id: req.params.lead_id,
                        completed: 0
                    }
                });

                return res.status(200).send({ status: "success", message: "Success created!", followups: followups });
            }
            return res.status(400).send({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }

    async create(req, res) {
        try {
            if ("user_id" in req.body && "lead_id" in req.body && "datetime" in req.body) {

                client.emit("create_followup", req.body);

                return res.status(200).send({ status: "success", message: "Success created!" });
            }
            return res.status(400).send({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }

    async update(req, res) {
        try {
            if ("id" in req.body && "followup" in req.body) {
                await models.Followups.update(req.body.followup, {
                    where: {
                        id: req.body.id
                    }
                });

                const updatedFollowup = await models.Followups.findOne({
                    where: {
                        id: req.body.id
                    }
                });

                if (req.body.followup.completed) {
                    client.emit("delete_followup", updatedFollowup.id);
                } else {
                    client.emit("update_followup", updatedFollowup);
                }

                return res.status(200).send({ status: "success", message: "Success edited!" });
            }
            return res.status(400).send({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }

    async delete(req, res) {
        try {
            if ("id" in req.body) {
                await models.Followups.destroy({
                    where: { id: req.body.id }
                });
                client.emit("delete_followup", req.body.id);
                return res.status(200).send({ status: "success", message: "Success deleted!" });
            }
            return res.status(400).send({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }
}

module.exports = new FollowUpController;