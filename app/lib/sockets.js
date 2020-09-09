const models = require('../../database/models');
const { createLead, updateLead } = require('../services/LeadService');
const LeadRepository = require('../repository/LeadRepository');
const RecordsRepository = require('../repository/RecordsRepository');
const RowLeadRepository = require('../repository/RowLeadsRepository');

module.exports = server => {

    const io = require("socket.io")(server);
    const users = {};

    io.on('connection', socket => {

        socket.on("connected", user => {
            users[socket.id] = {
                user,
                socket
            };
            console.log('User connected! ', users[socket.id].user);
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
                        const candidate_lead = await updateLead(lead_exist, lead, "ninjaQuoter", agent);

                        if (candidate_lead) {
                            const res_lead = await LeadRepository.getOne(candidate_lead.id);

                            if (res_lead) {
                                console.log("res_lead-update", res_lead);
                                io.sockets.emit("UPDATE_LEAD", res_lead);
                                // io.sockets.emit("UPDATE_LEADS", res_lead);
                            }
                        }
                    } else {
                        const candidate_lead = await createLead(lead, "ninjaQuoter", agent);

                        if (candidate_lead) {
                            const res_lead = await LeadRepository.getOne(candidate_lead.id);

                            if (res_lead) {
                                console.log("res_lead-create", res_lead);

                                for (const key in users) {
                                    if (users.hasOwnProperty(key)) {
                                        const user = users[key];

                                        if (user.user.states) {
                                            for (let i = 0; i < user.user.states.length; i++) {
                                                if (user.user.states[i] == res_lead.property.state) {
                                                    user.socket.emit("CREATE_LEAD", res_lead);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                throw new Error(error);
            }
        });

        socket.on('row-leads', async (idArray) => {
            try {
                const rowLeads = await RowLeadRepository.getLatest(idArray);
                io.sockets.emit("ROW_LEAD_ADD", rowLeads);
            } catch (error) {
                throw new Error(error);
            }
        });

        socket.on("busy-lead", async lead_id => {
            socket.join(lead_id);

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

        socket.on("unbusy-lead", async lead_id => {

            try {
                const candidate = await models.Leads.findOne({
                    where: { id: lead_id }
                });

                if (candidate) {
                    candidate.update({
                        busy: 0,
                        busy_agent_id: null
                    }).then(async res => {
                        const lead = await LeadRepository.getOne(res.id);

                        io.sockets.emit("UPDATE_LEADS", lead);
                    }).catch(err => console.log(err));
                }

            } catch (error) {
                throw new Error(error);
            }
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

            try {
                const candidate = await models.Leads.findOne({
                    where: { busy_agent_id: users[socket.id].id }
                });

                if (candidate) {
                    candidate.update({
                        busy: 0,
                        busy_agent_id: null
                    }).then(async res => {
                        const lead = await LeadRepository.getOne(res.id);

                        io.sockets.emit("UPDATE_LEADS", lead);
                    }).catch(err => console.log(err));
                }

            } catch (error) {
                throw new Error(error);
            }

            delete users[socket.id];
        });

    });

    return io;
};