const { createLead } = require('../services/LeadService');
const LeadRepository = require('../repository/LeadRepository');

module.exports = server => {

    const io = require("socket.io")(server);

    io.on('connection', socket => {
        console.log("Socket connection!");
        socket.on("new-lead", async data => {
            console.log("data", data)
            try {
                const candidateLead = await createLead(data, "ninjaQuoter", 1);

                if (candidateLead) {
                    const lead = await LeadRepository.getOne(candidateLead.id);

                    if (lead) {
                        io.sockets.emit("UPDATE_LEAD", lead);
                    }

                }
            } catch (error) {
                console.log(error);
            }
        });
    });
};