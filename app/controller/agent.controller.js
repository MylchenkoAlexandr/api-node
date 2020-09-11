const AgentService = require('../services/agent.service');
const bcrypt = require('bcrypt');

async function createAgent(req, res) {
    try {
        const agent = req.body;
        agent.password = await bcrypt.hash(agent.password, 10);
        agent.states = JSON.stringify(agent.states);

        console.log("createAgent -> agent", agent)

        const response = await AgentService.create(agent);

        res.status(response.code).json({
            status: response.status,
            message: response.message
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Server error!"
        });
        throw new Error(error);
    }
}

async function updateAgent(req, res) {
    try {
        const agent = req.body;
        agent.id = req.params.agent_id;
        agent.states = JSON.stringify(agent.states);

        if (req.body.password) {
            agent.new_password = await bcrypt.hash(agent.password, 10);
            delete agent.password;
        }

        const response = await AgentService.update(agent);

        res.status(response.code).json({
            status: response.status,
            message: response.message
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: 'Server error'
        });
        throw new Error(error);
    }
}

async function deleteAgent(req, res) {
    try {
        const response = await AgentService.delete(req.params.agent_id);

        res.status(response.code).json({
            status: response.status,
            message: response.message
        });

    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Server error"
        });
        throw new Error(error);
    }
}

async function updateAgentPassword(req, res) {
    const passwords = {
        old_password: req.body.old_password,
        new_password: req.body.new_password,
    };

    try {
        const response = await AgentService.updatePassword(passwords, req.params.agent_id);

        res.status(response.code).json({
            status: response.status,
            message: response.message
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: "Server error!"
        });
        throw new Error(error);
    }
}

async function getAgents(req, res) {
    try {
        const agents = await AgentService.getAll();

        res.status(200).json(agents);
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Server error"
        });
        throw new Error(error);
    }
}

// TODO CREATE FUNCTION FOR SELF EDITING OF AGENT ACCOUNT, CHANGING PASSWORD|

module.exports = {
    getAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    updateAgentPassword
}