const { createLead, updateLead } = require('../services/LeadService');
const AgentService = require('../services/agent.service');
const LeadRepository = require('../repository/LeadRepository');
const RecordsRepository = require('../repository/RecordsRepository');
const models = require('../../database/models');
const FormatService = require('../services/format.service')

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

        socket.on("process-lead", async (lead) => {
            try {
                // const account_banned = await AgentService.checkedBan(users[socket.id].email);

                // if (account_banned) {
                //     socket.emit("BANNED", {
                //         status: 'error',
                //         message: "Your account has been banned"
                //     });
                // } else {

                const formatedLead = await FormatService.formatLead(lead);

                let exist = await models.Leads.findOne({
                    where: {
                        type_id: formatedLead.type_id,
                        phone: formatedLead.phone
                    }
                });

                let uploadedLead;

                if (exist) {
                    uploadedLead = await updateLead(exist, formatedLead, '');

                    if (uploadedLead) {
                        io.sockets.to(uploadedLead.id).emit("UPDATE_LEAD", uploadedLead);
                        io.sockets.to("all_states").to(uploadedLead.property.state).emit("UPDATE_LEADS", uploadedLead);

                        if (formatedLead.empty) {
                            io.sockets.to("all_states").to(res_lead.property.state).emit("CREATE_LEAD", res_lead);
                        }
                    }
                } else {
                    uploadedLead = await createLead(formatedLead, '');

                    if (uploadLead) {
                        io.sockets.to("all_states").to(uploadLead.property.state).emit("CREATE_LEAD", uploadLead);
                    }
                }

                // if (lead.property.email) {
                //     lead_exist = await models.Leads.findOne({
                //         where: {
                //             email: lead.property.email
                //         }
                //     });
                // } else if (lead.id) {
                //     lead_exist = await models.Leads.findOne({
                //         where: {
                //             id: lead.id
                //         }
                //     });
                // } else {
                //     lead_exist = false;
                // }

                // let emptyStatus = lead.empty == 1 ? true : false;

                // if (lead_exist) {
                //     const candidate_lead = await updateLead(lead_exist, lead, "ninjaQuoter", agent);

                //     if (candidate_lead) {
                //         const res_lead = await LeadRepository.getOne(candidate_lead.id);

                //         if (res_lead) {
                //             io.sockets.to(res_lead.id).emit("UPDATE_LEAD", res_lead);
                //             io.sockets.to("all_states").to(res_lead.property.state).emit("UPDATE_LEADS", res_lead);
                //         }

                //         if (emptyStatus) {
                //             io.sockets.to("all_states").to(res_lead.property.state).emit("CREATE_LEAD", res_lead);
                //         }
                //     }
                // } else {
                //     const candidate_lead = await createLead(lead, "ninjaQuoter", agent);

                //     if (candidate_lead) {
                //         const res_lead = await LeadRepository.getOne(candidate_lead.id);

                //         if (res_lead) {
                //             io.sockets.to("all_states").to(res_lead.property.state).emit("CREATE_LEAD", res_lead);
                //         }
                //     }
                // }
                // }
            } catch (err) {
                throw err;
            }
        });

        socket.on('raw-leads', async (idArray) => {
            try {
                const rawLeads = await LeadRepository.getLatest(idArray);
                if (rawLeads)
                    io.sockets.emit("RAW_LEAD_ADD", rawLeads);

            } catch (error) {
                console.log(error);
            }
        });

        socket.on("busy-lead", lead_id => {
            socket.join(lead_id, async () => {
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