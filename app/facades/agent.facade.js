const AgentService = require('../services/agent.service');
const models = require('../../database/models');
const bcrypt = require('bcrypt');


class AgentFacade {

    /**
     * The function for create agent
     * @param {object} agent this object with agenet params
     * @return {object} this object with response params
     */
    async createAgent(agent) {
        try {
            const candidate = await AgentService.find(agent.email);

            if (candidate) return { code: 409, status: "error", message: "Agent with current email already exist" };

            agent.password = await bcrypt.hash(agent.password, 10);
            agent.states = JSON.stringify(agent.states);
            agent.email_credentials = JSON.stringify(agent.email_credentials);

            await AgentService.create(agent);

            return { code: 201, status: "success", message: "Agent succesfull created" };
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for update agent
     * @param {object} agent_params this object with agent params
     * @param {number} agent_id
     * @return {object} this object with response params
     */
    async updateAgent(agent_params, agent_id) {
        try {
            const candidate = await AgentService.findById(agent_id);

            if (candidate) {
                const agent = agent_params;

                agent.id = agent_id;
                agent.states = JSON.stringify(agent.states);
                agent.email_credentials = JSON.stringify(agent.email_credentials);
                if (agent_params.password != null && agent_params != '') agent_params.new_password = await bcrypt.hash(agent.password, 10);
                delete agent.password;

                if (agent.subroles) {
                    await models.UsersSubroles.destroy({
                        where: {
                            user_id: agent.id
                        }
                    });

                    agent.subroles.forEach(async (id) => {
                        await models.UsersSubroles.create({
                            user_id: agent.id,
                            subrole_id: id
                        });
                    });
                }

                await AgentService.update(candidate, agent);
                return { code: 200, status: 'success', message: 'Agent successfully updated' };
            }

            return { code: 400, status: 'error', message: 'Agent not found' };
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for delete agent
     * @param {number} agent_id
     * @return {object} this object with response params
     */
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

    /**
     * The function for update agent password
     * @param {object} passwords this object have params new password and old password
     * @param {number} agent_id
     * @return {object} this object with response params
     */
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

    /**
     * The function for get all agents
     * @return {object} this object with response params
     */
    async getAgents() {
        try {
            const agents = await AgentService.getAll();

            return { code: 200, status: 'success', agents };
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for get all agents that can quote a specific state
     * @param {number} state_id
     * @return {object} this object with response params
     */
    async getSuitableAgents(state_id) {
        try {
            const agents = await AgentService.getAllSuitable(state_id);

            return { code: 200, status: 'success', agents };
        } catch (err) {
            throw err;
        }
    }

    /**
     * The function for completed lead for agent who has uncompleted lead
     * @param {number} agent_id
     * @return {object} this object with response params
     */
    async completedLead(agent_id) {
        try {
            await AgentService.completedLead(agent_id);

            return { code: 200, status: 'success', message: 'Lead completed' };
        } catch (err) {
            throw err;
        }
    }

    /**
     * The function for assigning an uncompleted lead to an agent
     * @param {number} agent_id
     * @param {number} lead_id
     * @return {object} this object with response params
     */
    async startWork(agent_id, lead_id) {
        try {
            await AgentService.startWorkWithLead(agent_id, lead_id);

            return { code: 200, status: 'success', message: 'Start work with lead' };
        } catch (error) {
            throw error;
        }
    }

    async getOnlineAgents() {
        try {
            return await AgentService.getOnlineAgents();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AgentFacade;