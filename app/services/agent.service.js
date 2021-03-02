const models = require('../../database/models');
const StatesRepository = require('../repository/states.repository');
const AgentRepository = require('../repository/agent.repository');

class AgentService {
    /**
     * The function for create agent
     * @param {Object} agent 
     */
    async create(agent) {
        try {
            const { dataValues: createdAgent } = await models.Users.create({
                role_id: agent.role_id,
                fname: agent.fname,
                lname: agent.lname,
                email: agent.email,
                email_credentials: agent.email_credentials,
                twilio_phone: agent.twilio_phone,
                password: agent.password,
                states: agent.states,
                not_assign: agent.not_assign
            });

            if (createdAgent && createdAgent.role_id == 2) {
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
                const subroles = agent.subroles;

                if (subroles) {
                    await models.UsersSubroles.destroy({
                        where: {
                            user_id: createdAgent.id
                        }
                    });

                    subroles.forEach(async (id) => {
                        await models.UsersSubroles.create({
                            user_id: createdAgent.id,
                            subrole_id: id
                        });
                    });
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
    async update(agent_candidate, agent_options) {
        try {

            if (agent_options.new_password) {
                await agent_candidate.update({
                    fname: agent_options.fname,
                    lname: agent_options.lname,
                    email: agent_options.email,
                    email_credentials: agent_options.email_credentials,
                    twilio_phone: agent_options.twilio_phone,
                    password: agent_options.new_password,
                    states: agent_options.states,
                    banned: agent_options.banned,
                    not_assign: agent_options.not_assign
                });
            } else {
                await agent_candidate.update({
                    fname: agent_options.fname,
                    lname: agent_options.lname,
                    email: agent_options.email,
                    email_credentials: agent_options.email_credentials,
                    twilio_phone: agent_options.twilio_phone,
                    states: agent_options.states,
                    banned: agent_options.banned,
                    not_assign: agent_options.not_assign
                });
            }

            let states = JSON.parse(agent_options.states);

            let leads = await models.Leads.findAll({
                where: {
                    user_id: agent_options.id
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
                            user_id: agent_options.id,
                        }
                    });

                    Object.keys(leads).forEach(index => {
                        if (leads[index].state_id == stateId.id) {
                            leads[index].update({
                                user_id: agent_options.id,
                            });
                        }
                    });

                    await models.UsersStates.create({
                        user_id: agent_options.id,
                        state_id: stateId.id
                    });
                }
            });

        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for getting all agents
     */
    async getAll() {
        try {
            let agents = [];
            const agentsNotFormated = await models.Users.findAll({
                where: { role_id: 2 }
            const agents = await models.Users.findAll({
                where: { role_id: 2 },
                order: [
                    ['fname', 'ASC']
                ],
            });

            for (let agent of agentsNotFormated) {
                delete agent.password;
                agent.dataValues.states = JSON.parse(agent.dataValues.states);
                agent.dataValues.email_credentials = JSON.parse(agent.dataValues.email_credentials);
                agent.dataValues.fullname = agent.dataValues.fname + ' ' + agent.dataValues.lname;

                const subroles = await models.UsersSubroles.findAll({
                    where: {
                        user_id: agent.dataValues.id
                    }
                });

                agent.dataValues.subroles = subroles.length >= 1 ? subroles.map(subrole => subrole.subrole_id) : [];

                agents.push(agent);
            };

            return agents;
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
     * The function for find agent by id
     * @param {number} agent_id 
     */
    async findById(agent_id) {
        try {
            const user = await models.Users.findOne({
                where: { id: agent_id }
            });

            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function for deleting agent by link on model
     * @param {object} agent 
     */
    async delete(agent) {
        try {
            await agent.destroy();
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
    async updatePassword(password, agent) {
        try {
            await agent.update({ password });
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

    async uncompletedLead(email) {
        try {
            const lead_id = await AgentRepository.getUncompeletedLead(email);

            return lead_id;
        } catch (error) {
            throw error;
        }
    }

    async startWorkWithLead(agent_id, lead_id) {
        try {
            const agent_candidate = await models.Users.findOne({
                where: { id: agent_id }
            });

            await agent_candidate.update({
                uncompleted_lead: lead_id
            });
        } catch (error) {
            throw error;
        }
    }

    async completedLead(agent_id) {
        try {
            const agent_candidate = await models.Users.findOne({
                where: { id: agent_id }
            });

            await agent_candidate.update({
                uncompleted_lead: null
            });

        } catch (error) {
            throw error;
        }
    }

    async getOnlineAgents() {
        try {
            return await AgentRepository.onlineAgents();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AgentService;