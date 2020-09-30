const AgentService = require('../services/agent.service');
const bcrypt = require('bcrypt');

async function createAgent(req, res) {
    try {
        if (("fname" in req.body)
            && ("lname" in req.body)
            && ("email" in req.body)
            && ("password" in req.body)
            && ("states" in req.body)
        ) {
            const agent = req.body;
            agent.password = await bcrypt.hash(agent.password, 10);
            agent.states = JSON.stringify(agent.states);

            const response = await AgentService.create(agent);

            return res.status(response.code).json({ status: response.status, message: response.message });
        }

        return res.status(400).json({ status: 'error', message: 'Bad Request' });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error" });
        throw error;
    }
}

async function updateAgent(req, res) {
    try {
        if (("fname" in req.body)
            && ("lname" in req.body)
            && ("email" in req.body)
            && ("states" in req.body)
            && ("banned" in req.body)
        ) {
            const agent = req.body;

            if (req.body.password) agent.new_password = await bcrypt.hash(agent.password, 10);
            agent.id = req.params.agent_id;
            agent.states = JSON.stringify(agent.states);
            delete agent.password;

            const response = await AgentService.update(agent);
            return res.status(response.code).json({ status: response.status, message: response.message });
        }

        return res.status(400).json({ status: 'error', message: 'Bad Request' });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error" });
        throw error;
    }
}

async function deleteAgent(req, res) {
    try {
        const response = await AgentService.delete(req.params.agent_id);

        return res.status(response.code).json({ status: response.status, message: response.message });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error" });
        throw error;
    }
}

async function updateAgentPassword(req, res) {
    const passwords = {
        old_password: req.body.old_password,
        new_password: req.body.new_password,
    };

    try {
        if (("old_password" in req.body) && ("new_password" in req.body)) {
            const response = await AgentService.updatePassword(passwords, req.params.agent_id);

            return res.status(response.code).json({ status: response.status, message: response.message });
        }

        return res.status(400).json({ status: 'error', message: 'Bad Request' });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

async function getAgents(req, res) {
    try {
        const agents = await AgentService.getAll();

        return res.status(200).json({ status: 'success', agents });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

async function getSuitableAgents(req, res) {
    try {
        if ("state_id" in req.body) {
            const agents = await AgentService.getAllSuitable(req.body.state_id);

            return res.status(200).json({ status: 'success', agents });
        }

        return res.status(400).json({ status: 'error', message: 'Bad Request' });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw err;
    }
}

module.exports = {
    getAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    getSuitableAgents,
    updateAgentPassword
}