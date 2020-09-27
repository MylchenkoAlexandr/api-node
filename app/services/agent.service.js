const models = require('../../database/models');
const bcrypt = require('bcrypt');
const StatesRepository = require('../repository/states.repository');
const AgentRepository = require('../repository/agent.repository');
class AgentService {
    /**
     * The function for create agent
     * @param {Object} agent 
     */
    async create(agent) {
        try {
            const user_exist = await models.Users.findOne({
                attributes: ['id'],
                where: {
                    email: agent.email
                }
            })

            if (!user_exist) {
                const createdAgent = await models.Users.create({
                    role_id: 2,
                    fname: agent.fname,
                    lname: agent.lname,
                    email: agent.email,
                    password: agent.password,
                    states: agent.states
                });

                if (createdAgent) {
                    let states = JSON.parse(agent.states)

                    states.map(async (state) => {
                        let stateId = await StatesRepository.getOne(state);

                        if (stateId) {
                            await models.UsersStates.create({
                                user_id: createdAgent.id,
                                state_id: stateId.id
                            });
                        }
                    });
                }

                return {
                    code: 201,
                    status: "success",
                    message: "Agent succesfull created"
                }
            } else {
                return {
                    code: 200,
                    status: "error",
                    message: "Agent with current email already exist"
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for update agent
     * @param {Object} agent 
     */
    async update(agent) {
        try {
            const agent_candidate = await models.Users.findOne({
                where: { id: agent.id }
            });

            if (agent_candidate) {

                if (agent.new_password) {
                    await agent_candidate.update({
                        fname: agent.fname,
                        lname: agent.lname,
                        email: agent.email,
                        password: agent.new_password,
                        states: agent.states,
                        banned: agent.banned
                    });
                } else {
                    await agent_candidate.update({
                        fname: agent.fname,
                        lname: agent.lname,
                        email: agent.email,
                        states: agent.states,
                        banned: agent.banned
                    });
                }

                let states = JSON.parse(agent.states);

                let leads = await models.Leads.findAll({
                    where: {
                        user_id: agent.id
                    }
                });

                Object.keys(leads).forEach(index => {
                    leads[index].update({
                        user_id: null
                    });
                });

                states.map(async (state) => {
                    let stateId = await StatesRepository.getOne(state);

                    if (stateId) {
                        await models.UsersStates.destroy({
                            where: {
                                user_id: agent.id,
                            }
                        });

                        Object.keys(leads).forEach(index => {
                            if (leads[index].state_id == stateId.id) {
                                leads[index].update({
                                    user_id: agent.id,
                                });
                            }
                        });

                        await models.UsersStates.create({
                            user_id: agent.id,
                            state_id: stateId.id
                        });
                    }
                });

                return { code: 200, status: "success", message: 'Agent updated' };
            }
            return { code: 200, status: "error", message: 'Agent not found' };

        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for getting all agents
     */
    async getAll() {
        try {
            const agents = await models.Users.findAll({
                where: { role_id: 2 }
            });

            if (agents) {
                agents.forEach(agent => {
                    delete agent.dataValues.password;
                    agent.dataValues.states = JSON.parse(agent.dataValues.states);
                });

                return agents;
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for getting agent by state
     * @param {number} state_id 
     */
    async getAllSuitable(state_id) {
        try {
            const agents = await AgentRepository.getAgentByState(state_id);

            return agents;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for find agent by email
     * @param {string} email 
     */
    async find(email) {
        try {
            const user = await models.Users.findOne({
                where: { email }
            });

            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for deleting agent by id
     * @param {number} agent_id 
     */
    async delete(agent_id) {
        try {
            const agent_candidate = await models.Users.findOne({
                where: { id: agent_id }
            });

            if (agent_candidate) {
                await agent_candidate.destroy();

                return {
                    code: 200,
                    status: "success",
                    message: "Agent removed success!"
                }
            } else {
                return {
                    code: 200,
                    status: "error",
                    message: "Agent dont't removed"
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for update agent password
     * @param {string} old_password 
     * @param {string} new_password 
     * @param {number} agent_id 
     */
    async updatePassword({ old_password, new_password }, agent_id) {
        try {
            const agent_candidate = await models.Users.findOne({
                where: { id: agent_id }
            });

            if (agent_candidate) {
                const password_mathes = await bcrypt.compare(old_password, agent_candidate.dataValues.password);

                if (password_mathes) {
                    const password = await bcrypt.hash(new_password, 10);

                    await agent_candidate.update({
                        password
                    });

                    return {
                        code: 200,
                        status: 'success',
                        message: "Password updated!"
                    }
                } else {
                    return {
                        code: 200,
                        status: 'failed',
                        message: "Password don't mathes"
                    }
                }

            } else {
                return {
                    code: 200,
                    status: 'failed',
                    message: "Agent not exist!"
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for checking banned agent
     * @param {string} email 
     */
    async checkedBan(email) {
        try {
            const agent_candidate = await models.Users.findOne({
                where: { email }
            });

            return agent_candidate.dataValues.banned;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for checking admin role
     * @param {string} email 
     */
    async checkAdmin(email) {
        try {
            const agent_candidate = await models.Users.findOne({
                where: { email }
            });

            return agent_candidate.dataValues.role_id == 1 ? true : false;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AgentService;