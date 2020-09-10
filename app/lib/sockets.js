const { createLead, updateLead } = require('../services/LeadService');
const LeadRepository = require('../repository/LeadRepository');
const RecordsRepository = require('../repository/RecordsRepository');
const models = require('../../database/models')

module.exports = server => {

    const io = require("socket.io")(server);
    const users = {};

    io.on('connection', socket => {

        socket.on("connected", user => {
            users[socket.id] = user;
            console.log('User connected! ', users[socket.id]);

            if (user.states) {
                for (let index = 0; index < user.states.length; index++) {
                    socket.join(user.states[index]);
                }
            } else {
                socket.join("all_states");
            }
        });

        socket.on("process-lead", async ({ lead, agent }) => {
            try {
                const type = await models.Types.findOne({
                    attributes: ['id'],
                    where: {
                        name: lead.property.type
                    }
                })

                if (type) {
                    const lead_exist = await models.Leads.findOne({
                        where: {
                            email: lead.property.email,
                            type_id: type.dataValues.id,
                        }
                    });

                    if (lead_exist) {
                        let emptyStatus = lead.empty == 1 ? true : false;

                        const candidate_lead = await updateLead(lead_exist, lead, "ninjaQuoter", agent);

                        if (candidate_lead) {
                            const res_lead = await LeadRepository.getOne(candidate_lead.id);

                            if (res_lead) {
                                io.sockets.to(res_lead.id).emit("UPDATE_LEAD", res_lead);
                                io.sockets.to("all_states").to(res_lead.property.state).emit("UPDATE_LEADS", res_lead);
                            }

                            if (emptyStatus) {
                                io.sockets.to("all_states").to(res_lead.property.state).emit("CREATE_LEAD", res_lead);
                            }
                        }
                    } else {
                        const candidate_lead = await createLead(lead, "ninjaQuoter", agent);

                        if (candidate_lead) {
                            const res_lead = await LeadRepository.getOne(candidate_lead.id);

                            if (res_lead) {
                                io.sockets.to("all_states").to(res_lead.property.state).emit("CREATE_LEAD", res_lead);
                            }
                        }
                    }
                }
            } catch (error) {
                throw new Error(error);
            }
        });
        // socket.to(lead.state).emit(CREATE_LEAD)
        socket.on('row-leads', async (idArray) => {
            try {
                const rowLeads = await LeadRepository.getLatest(idArray);
                if (rowLeads)
                    io.sockets.emit("ROW_LEAD_ADD", rowLeads);

            } catch (error) {
                console.log(error);
            }
        });

        socket.on("busy-lead", lead_id => {
            socket.join(lead_id, async () => {
                console.log(`User - ${users[socket.id].fname}, join to room - ${lead_id}`);

                try {
                    const candidate = await models.Leads.findOne({
                        where: { id: lead_id }
                    });

                    if (candidate) {
                        await candidate.update({
                            busy: 1,
                            busy_agent_id: users[socket.id].id
                        });

                        const lead = await LeadRepository.getOne(candidate.id);

                        io.sockets.emit("UPDATE_LEADS", lead);
                    }

                } catch (error) {
                    throw new Error(error);
                }
            });
        });

        socket.on("unbusy-lead", lead_id => {
            socket.leave(lead_id, async () => {
                try {
                    const candidate = await models.Leads.findOne({
                        where: { id: lead_id }
                    });

                    if (candidate) {
                        await candidate.update({
                            busy: 0,
                            busy_agent_id: null
                        });
                        const lead = await LeadRepository.getOne(candidate.id);

                        io.sockets.emit("UPDATE_LEADS", lead);
                    }

                } catch (error) {
                    throw new Error(error);
                }
            })
        });

        socket.on("record-create", async ({ user_id, lead_id, url }) => {

            try {
                const new_record = await models.Records.create({
                    user_id: user_id,
                    lead_id: lead_id,
                    url: url
                })

                if (new_record) {
                    const one_record = await RecordsRepository.getOne(new_record.id);
                    socket.to(lead_id).emit("RECORD_ADD", one_record);
                }
            } catch (error) {
                throw new Error(error);
            }
        });

        socket.on('disconnect', async () => {
            console.log('User disconnected! ', users[socket.id]);

            socket.leaveAll();

            try {
                const candidate = await models.Leads.findOne({
                    where: { busy_agent_id: users[socket.id].id }
                });

                if (candidate) {
                    await candidate.update({
                        busy: 0,
                        busy_agent_id: null
                    });
                    const lead = await LeadRepository.getOne(candidate.id);

                    io.sockets.emit("UPDATE_LEADS", lead);
                }

            } catch (error) {
                throw new Error(error);
            }

            delete users[socket.id];
        });

    });

    return io;
};