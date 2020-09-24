const LeadService = require('../services/lead.service');
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
            console.log('User connected!', users[socket.id].email);

            if (user.states) {
                for (let index = 0; index < user.states.length; index++) {
                    socket.join(user.states[index]);
                }
            } else {
                socket.join("all_states");
            }

            // TODO create room for user_id
            socket.join(user.id);
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

                let quoter = "ninjaQuoter";

                if (lead.type) {
                    switch (lead.type) {
                        case "life":
                            quoter = "ninjaQuoter";
                            break;
                    }
                }

                const formatedLead = await FormatService.formatLead(lead);

                let exist = await LeadService.foundExistLead(formatedLead);

                let uploadedLead;

                if (exist) {
                    const emptyStatus = exist.empty;
                    if (exist.empty == 0 && formatedLead.empty == 1) {
                        console.error("Skipped by checking if exist with filled data already in system!", formatedLead.email);
                    } else {
                        uploadedLead = await LeadService.updateLead(exist, formatedLead, quoter);

                        if (uploadedLead) {
                            io.sockets.to(uploadedLead.id).emit("UPDATE_LEAD", uploadedLead);
                            io.sockets.to("all_states").to(uploadedLead.state).emit("UPDATE_LEADS", uploadedLead);

                            if (emptyStatus) {
                                io.sockets.to("all_states").to(uploadedLead.state).emit("CREATE_LEAD", uploadedLead);
                                // TODO Write emit for removing raw lead from table
                            }
                        }
                    }
                } else {
                    uploadedLead = await LeadService.createLead(formatedLead, quoter);

                    if (uploadedLead) {
                        if (uploadedLead.empty == 0) {
                            if (uploadedLead.user_id) {
                                io.sockets.to("all_states").to(uploadedLead.user_id).emit("CREATE_LEAD", uploadedLead);
                            } else {
                                io.sockets.to("all_states").to(uploadedLead.state).emit("CREATE_LEAD", uploadedLead);
                            }
                        }

                        if (uploadedLead.empty == 1) {
                            io.sockets.emit("RAW_LEAD_ADD", uploadedLead);
                        }
                    }
                }
            } catch (err) {
                throw err;
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
                    throw error;
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
            if (users[socket.id]) {
                socket.leaveAll();
                try {
                    console.log('User disconnected!', users[socket.id].email);

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
                    throw error;
                }
                delete users[socket.id];
            }
        });

    });

    return io;
};