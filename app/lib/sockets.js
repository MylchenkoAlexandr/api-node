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
        });

        socket.on('test', ({ msg }) => {
            console.log(msg);
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
                    const exist = await models.Leads.findOne({
                        where: {
                            email: lead.property.email,
                            type_id: type.dataValues.id,
                        }
                    });

                    if (exist) {
                        const candidateLead = await updateLead(exist, lead, "ninjaQuoter", agent);

                        if (candidateLead) {
                            const resLead = await LeadRepository.getOne(candidateLead.id);
                            if (resLead) {
                                io.sockets.emit("UPDATE_LEADS", resLead);
                            }
                        }
                    } else {
                        const candidateLead = await createLead(lead, "ninjaQuoter", agent);

                        if (candidateLead) {
                            const resLead = await LeadRepository.getOne(candidateLead.id);
                            if (resLead) {
                                io.sockets.emit("CREATE_LEAD", resLead);
                            }
                        }
                    }
                }
            } catch (error) {
                console.log(error);
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

        socket.on("busy-lead", async lead_id => {
            console.log("lead_id", lead_id);
            socket.join(lead_id);

            try {
                const candidate = await models.Leads.findOne({
                    where: { id: lead_id }
                });

                if (candidate) {
                    candidate.update({
                        busy: 1,
                        busy_agent_id: users[socket.id].id
                    }).then(async res => {
                        const lead = await LeadRepository.getOne(res.id);

                        io.sockets.emit("UPDATE_LEADS", lead);
                    }).catch(err => console.log(err));
                }

            } catch (error) {
                console.log(error);
            }
        });

        socket.on("unbusy-lead", async lead_id => {
            console.log("lead_id", lead_id);

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
                console.log(error);
            }
        });

        socket.on("record-create", async ({ user_id, lead_id, url }) => {

            console.log("url", url)

            const newRecord = await models.Records.create({
                user_id: user_id,
                lead_id: lead_id,
                url: url
            })

            if (newRecord) {
                const oneRecord = await RecordsRepository.getOne(newRecord.id);
                socket.to(lead_id).emit("RECORD_ADD", oneRecord);
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
                console.log(error);
            }

            delete users[socket.id];
        });

    });

    return io;
};