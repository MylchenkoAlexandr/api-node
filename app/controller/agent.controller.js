const AgentFacade = require('../facades/agent.facade');
const CustomScriptsFacade = require('../facades/custom-scripts.facade');

async function createAgent(req, res) {
    try {
        if (("role_id" in req.body)
            && req.body.role_id != 1
            && ("fname" in req.body)
            && ("lname" in req.body)
            && ("email" in req.body)
            && ("password" in req.body)
            && ("states" in req.body)
        ) {
            const agent = req.body;
            const response = await AgentFacade.createAgent(agent);

            return res.status(response.code).json({ status: response.status, message: response.message });
        }

        return res.status(400).json({ status: 'error', message: 'Bad Request' });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
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
            const response = await AgentFacade.updateAgent(agent, req.params.agent_id);

            return res.status(response.code).json({ status: response.status, message: response.message });
        }

        return res.status(400).json({ status: 'error', message: 'Bad Request' });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

async function deleteAgent(req, res) {
    try {
        const response = await AgentFacade.deleteAgent(req.params.agent_id);

        return res.status(response.code).json({ status: response.status, message: response.message });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

async function updateAgentPassword(req, res) {
    try {
        if (("old_password" in req.body) && ("new_password" in req.body)) {
            const passwords = {
                old_password: req.body.old_password,
                new_password: req.body.new_password,
            };
            const response = await AgentFacade.updateAgentPassword(passwords, req.params.agent_id);

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
        const response = await AgentFacade.getAgents();

        return res.status(response.code).json({ status: response.status, agents: response.agents });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

async function getSuitableAgents(req, res) {
    try {
        if ("state_id" in req.body) {
            const response = await AgentFacade.getSuitableAgents(req.body.state_id);

            return res.status(response.code).json({ status: response.status, agents: response.agents });
        }

        return res.status(400).json({ status: 'error', message: 'Bad Request' });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw err;
    }
}

async function completedLead(req, res) {
    try {
        const response = await AgentFacade.completedLead(req.params.agent_id);

        return res.status(response.code).json({ status: response.status, message: response.message });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw err;
    }
}

async function startWork(req, res) {
    try {
        const response = await AgentFacade.startWork(req.params.agent_id, req.params.lead_id);

        return res.status(response.code).json({ status: response.status, message: response.message });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
        throw error;
    }
}

async function getAllScripts(req, res) {
    try {
        const script_options = {
            agent_id: req.params.agent_id,
            type_id: req.params.type_id,
        };

        const response = await CustomScriptsFacade.getCustomScripts(script_options);
        return res.status(response.code).json({ status: response.status, scripts: response.scripts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
        throw error;
    }
}

async function createScript(req, res) {
    try {
        if (("agent_id" in req.body)
            && ("type_id" in req.body)
            && ("html" in req.body)
        ) {
            const script_options = {
                agent_id: req.body.agent_id,
                type_id: req.body.type_id,
                html: req.body.html
            }

            const response = await CustomScriptsFacade.createCustomScript(script_options);
            return res.status(response.code).json({ status: response.status, message: response.message, script: response.script });
        }

        return res.status(400).json({ status: 'error', message: 'Client Error' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
        throw error;
    }
}

async function updateScript(req, res) {
    try {
        if ("html" in req.body) {
            const script_options = {
                script_id: req.params.script_id,
                html: req.body.html
            };

            const response = await CustomScriptsFacade.updateCustomScript(script_options);
            return res.status(response.code).json({ status: response.status, message: response.message });
        }

        return res.status(400).json({ status: 'error', message: 'Client Error' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
        throw error;
    }
}

async function deleteScript(req, res) {
    try {
        const response = await CustomScriptsFacade.deleteCustomScriptById(req.params.script_id);

        return res.status(response.code).json({ status: response.status, message: response.message });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
        throw error;
    }
}

module.exports = {
    getAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    getSuitableAgents,
    updateAgentPassword,
    completedLead,
    startWork,
    createScript,
    getAllScripts,
    deleteScript,
    updateScript
}