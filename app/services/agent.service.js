const models = require('../../database/models');
const bcrypt = require('bcrypt');

class AgentService {
    async create(agent) {
        try {
            const user_exist = await models.Users.findOne({
                attributes: ['id'],
                where: {
                    email: agent.email
                }
            })

            if (!user_exist) {
                // await models.Users.create({
                //     role_id: 2,
                //     fname: agent.fname,
                //     lname: agent.lname,
                //     email: agent.email,
                //     password: agent.password,
                //     states: agent.states
                // });

                let states = JSON.parse(agent.states)
                
                console.log("AgentService -> create -> agent.states", states);

                states.map(i => {
                    console.log(i);
                })
                
                // await UsersStates.create

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
            throw new Error(error);
        }
    }

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

                return { code: 200, status: "success", message: 'Agent updated' };
            }
            return { code: 200, status: "error", message: 'Agent not found' };

        } catch (error) {
            throw new Error(error);
        }
    }

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
            throw new Error(error);
        }
    }

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
            throw new Error(error);
        }
    }

    async checkedBan(email) {
        const agent_candidate = await models.Users.findOne({
            where: { email }
        });

        return agent_candidate.dataValues.banned;
    }

    async checkAdmin(email) {
        const agent_candidate = await models.Users.findOne({
            where: { email }
        });

        return agent_candidate.dataValues.role_id == 1 ? true : false;
    }

    async create({ role_id, email, name, password, states }) {
        try {
            await models.Users.create({
                role_id,
                email,
                name,
                password,
                states
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AgentService;