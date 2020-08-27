const models = require('../../database/models')
const bcrypt = require('bcrypt');

async function createAgent(req, res) {
    try {
        const agent = req.body;

        console.log("createAgent -> agent", agent)

        const userExist = await models.Users.findOne({
            attributes: ['id'],
            where: {
                email: agent.email
            }
        })

        if (!userExist) {
            await models.Users.create({
                role_id: 2,
                fname: agent.fname,
                lname: agent.lname,
                email: agent.email,
                password: await bcrypt.hash(agent.password, 10),
                states: JSON.stringify(agent.states)
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
    await models.Users.update({
        fname: agent.fname,
        lname: agent.lname,
        email: agent.email,
        states: agent.states
    }, {
        where: {
            id: req.body.id
        },
    })
}

async function deleteAgent(req, res) {
    try {
        await models.Users.destroy({
            where: {
                id: req.body.id
            }
        });

        return res.status(200).json({
            message: "Agent removed success!"
        });
    } catch (error) {
        console.error(error);
    }

    return res.status(400).json({
        message: "Server error"
    });
}

// TODO CREATE FUNCTION FOR SELF EDITING OF AGENT ACCOUNT, CHANGING PASSWORD|

module.exports = {
    createAgent,
    updateAgent,
    deleteAgent
}