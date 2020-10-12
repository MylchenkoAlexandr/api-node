const AgentService = require('../services/agent.service');
const bcrypt = require('bcrypt');

class AgentFacade {
    async createAgent(agent) {
        try {
            const candidate = await AgentService.find(agent.email);

            if (candidate) return { code: 409, status: "error", message: "Agent with current email already exist" };

            agent.password = await bcrypt.hash(agent.password, 10);
            agent.states = JSON.stringify(agent.states);

            await AgentService.create(agent);

            return { code: 201, status: "success", message: "Agent succesfull created" };
        } catch (error) {
            throw error;
        }
    }

    async updateAgent(agent_options, agent_id) {
        try {
            const candidate = await AgentService.findById(agent_id);

            if (candidate) {
                const agent = agent_options;

                agent.id = agent_id;
                agent.states = JSON.stringify(agent.states);
                if (agent_options.password != null && agent_options != '') agent_options.new_password = await bcrypt.hash(agent.password, 10);
                delete agent.password;

                await AgentService.update(candidate, agent);
                return { code: 200, status: 'success', message: 'Agent successfully updated' };
            }

            return { code: 400, status: 'error', message: 'Agent not found' };
        } catch (error) {
            throw error;
        }
    }

    async deleteAgent(agent_id) {
        try {
            const candidate = await AgentService.findById(agent_id);

            if (candidate) {
                await AgentService.delete(candidate);
                return { code: 200, status: 'success', message: 'Agent successfully deleted' };
            }

            return { code: 400, status: 'error', message: 'Agent not found' };
        } catch (error) {
            throw error;
        }
    }

    async updateAgentPassword(passwords, agent_id) {

        try {
            const candidate = await AgentService.findById(agent_id);

            if (candidate) {
                const password_mathes = await bcrypt.compare(passwords.old_password, candidate.dataValues.password);

                if (password_mathes) {
                    const password = await bcrypt.hash(passwords.new_password, 10);

                    await AgentService.updatePassword(password, candidate);
                    return { code: 200, status: 'success', message: 'Password successfully updated' };
                }

                return { code: 409, status: 'error', message: "Password don't mathes" };
            }

            return { code: 409, status: 'error', message: "Agent not found" };
        } catch (error) {
            throw error;
        }
    }

    async getAgents() {
        try {
            const agents = await AgentService.getAll();

            return { code: 200, status: 'success', agents };
        } catch (error) {
            throw error;
        }
    }

    async getSuitableAgents(state_id) {
        try {
            const agents = await AgentService.getAllSuitable(state_id);

            return { code: 200, status: 'success', agents };
        } catch (err) {
            throw err;
        }
    }

    async completedLead(agent_id) {
        try {
            await AgentService.completedLead(agent_id);

            return { code: 200, status: 'success', message: 'Lead completed' };
        } catch (err) {
            throw err;
        }
    }

    async startWork(agent_id, lead_id) {
        try {
            await AgentService.startWorkWithLead(agent_id, lead_id);

            return { code: 200, status: 'success', message: 'Start work with lead' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AgentFacade;