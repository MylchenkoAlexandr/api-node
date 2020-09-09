const models = require('../../database/models');
const bcrypt = require('bcrypt');

async function createAgent(req, res) {
    try {
        const agent = req.body;
        agent.password = await bcrypt.hash(agent.password, 10);
        agent.states = JSON.stringify(agent.states);

        console.log("createAgent -> agent", agent)

        const user_exist = await models.Users.findOne({
            attributes: ['id'],
            where: {
                email: agent.email
            }
        })

        if (!user_exist) {
            await models.Users.create({
                role_id: 2,
                fname: agent.fname,
                lname: agent.lname,
                email: agent.email,
                password: agent.password,
                states: agent.states
            });

            return res.status(201).json({
                status: "success",
                message: "Agent succesfull created"
            });
        } else {
            return res.status(200).json({
                status: "failed",
                message: "Agent with current email already exist"
            });
        }
    } catch (error) {
        console.error(error);
    }

    return res.status(400).json({
        status: "failed",
        message: "Server error!"
    });
}

async function updateAgent(req, res) {
    try {
        const agent_candidate = await models.Users.findOne({
            where: { id: req.params.agent_id }
        });

        if (agent_candidate) {
            const agent = req.body;
            agent.password = await bcrypt.hash(agent.password, 10);
            agent.states = JSON.stringify(agent.states);

            await agent_candidate.update({
                fname: agent.fname,
                lname: agent.lname,
                email: agent.email,
                password: agent.password,
                states: agent.states
            });

            return res.status(200).json({
                status: "success",
                message: 'Agent updated'
            });
        } else {
            return res.status(200).json({
                status: "failed",
                message: 'Agent not found'
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: 'Server error'
        });
        throw new Error(error);
    }
}

async function deleteAgent(req, res) {
    try {
        const agent_candidate = await models.Users.findOne({
            where: { id: req.params.agent_id }
        });

        if (agent_candidate) {
            await agent_candidate.destroy();

            return res.status(200).json({
                status: "success",
                message: "Agent removed success!"
            });
        } else {
            return res.status(200).json({
                status: "failed",
                message: "Agent dont't removed"
            });
        }

    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: "Server error"
        });
        throw new Error(error);
    }
}

async function updateAgentPassword(req, res) {
    try {
        const agent_candidate = await models.Users.findOne({
            where: { id: req.params.agent_id }
        });

        if (agent_candidate) {
            const password_mathes = await bcrypt.compare(req.body.old_password, agent_candidate.dataValues.password);

            if (password_mathes) {
                const new_password = await bcrypt.hash(req.body.new_password, 10);

                await agent_candidate.update({
                    password: new_password
                });

                return res.status(200).json({
                    status: 'success',
                    message: "Password updated!"
                });
            } else {
                return res.status(200).json({
                    status: 'failed',
                    message: "Password don't mathes"
                });
            }
        } else {
            return res.status(200).json({
                status: 'failed',
                message: "Agent not exist!"
            });
        }
    } catch (error) {
        res.status(200).json({
            status: 'failed',
            message: "Server error!"
        });
        throw new Error(error);
    }
}

// TODO CREATE FUNCTION FOR SELF EDITING OF AGENT ACCOUNT, CHANGING PASSWORD|

module.exports = {
    createAgent,
    updateAgent,
    deleteAgent,
    updateAgentPassword
}