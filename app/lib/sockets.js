const { createLead, updateLead } = require('../services/LeadService');
const LeadRepository = require('../repository/LeadRepository');
const models = require('../../database/models')

module.exports = server => {

    const io = require("socket.io")(server);

    io.on('connection', socket => {
        console.log("Socket connection!");
        socket.on("new-lead", async data => {
            try {
                const type = await models.Types.findOne({
                    attributes: ['id'],
                    where: {
                        name: data.property.type
                    }
                })

                if (type) {
                    const exist = await models.Leads.findOne({
                        where: {
                            email: data.property.email,
                            type_id: type.dataValues.id,
                        }
                    })


                    if (exist) {
                        const candidateLead = await updateLead(exist, "ninjaQuoter", null);

                        if (candidateLead) {
                            const lead = await LeadRepository.getOne(candidateLead.id);
                            if (lead) {
                                io.sockets.emit("UPDATE_LEAD", lead);
                            }
                        }
                    } else {
                        const candidateLead = await createLead(data, "ninjaQuoter", null);

                        if (candidateLead) {
                            const lead = await LeadRepository.getOne(candidateLead.id);
                            if (lead) {
                                io.sockets.emit("CREATE_LEAD", lead);
                            }
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        });
    });
};