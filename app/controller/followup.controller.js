const models = require("../../database/models");
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const FollowUpsRepository = require("../repository/followups.repository");

class FollowUpController {
    async getByUserId(req, res) {
        try {
            if ("user_id" in req.params) {
                const user = await models.Users.findByPk(req.params.user_id);

                const followups = await FollowUpsRepository.getByUserId(user);
                return res.status(200).send({ status: "success", message: "Success", followups: followups });
            }
            return res.status(400).send({ status: "error", message: "Bad request!" })
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" })
            throw error;
        }
    }

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
     
    async getById(req, res) {
        try {
            if ("id" in req.params) {
                const followups = await models.Followups.findOne({
                    where: {
                        id: req.params.id
                    }
                });

                return res.status(200).send({ status: "success", message: "Success created!", followup: followups });
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
                const user = await models.Users.findOne({
                    where: {
                        id: req.body.user_id
                    }
                });

                if (user && user.role_id == 1) {
                    const lead = await models.Leads.findOne({
                        where: {
                            id: req.body.lead_id
                        }
                    });

                    if(lead && lead.user_id){
                        req.body.user_id = lead.user_id;
                    }
                }

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
                    client.emit("delete_followup", { id: updatedFollowup.id });
                    client.emit("update_followup", updatedFollowup);
                } else {
                    client.emit("update_followup", updatedFollowup);
                }

                return res.status(200).send({ status: "success", message: "Success edited!", followup: updatedFollowup });
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
                client.emit("delete_followup", { id: req.body.id });
                return res.status(200).send({ status: "success", message: "Success deleted!" });
            }
            return res.status(400).send({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }

    async filter(req, res) {
        try {
            if ("params" in req.body) {
                const followups = await FollowUpsRepository.filter(req.body.params);

                return res.status(200).send({ status: "success", message: "Success", followups: followups });
            }
            return res.status(400).send({ status: "error", message: "Bad request!" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server Error!" });
            throw error;
        }
    }

    async filterParams(req, res) {
        try {
            if ("user_id" in req.params) {
                const filterParams = await FollowUpsRepository.filterParams(req.params.user_id);
                return res.status(200).send({ status: "success", message: "Success", params: filterParams });
            }
            return res.status(400).send({ status: "error", message: "Bad request!" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server Error!" });
            throw error;
        }
    }
}

module.exports = new FollowUpController;