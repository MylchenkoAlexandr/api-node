const { createLead, updateLead } = require('../services/LeadService');
const LeadRepository = require('../repository/LeadRepository');
const models = require('../../database/models')

module.exports = server => {

    const io = require("socket.io")(server);

    io.on('connection', socket => {
        console.log("User connection!");
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
                                console.log("resLead", resLead);

                                io.sockets.emit("UPDATE_LEAD", resLead);
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

        socket.on('disconnect', function() {
            console.log('User disconnected!');
        });
    });

    // io.of('/admin').clients((error, clients) => {
    //     console.log("Admin connection");
    // });

    return io;
};