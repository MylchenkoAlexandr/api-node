const { createLead } = require('../services/LeadService');
const NinjaQuoterService = require('../services/NinjaQuoterService');

const preferedCompanies = {
    mutual_omaha: 0,
    royal_neighbors: 0,
    liberty_bankers: 0
};

module.exports = server => {

    const io = require("socket.io")(server);

    io.on('connection', socket => {
        console.log("Socket connection!");
        socket.on("new-lead", async data => {
            try {
                const lead = await createLead(data[0], "ninjaQuoter");
                
                // socket.emit("UPDATE_LEAD", lead);
            } catch (error) {
                console.log(error);
            }
        });
    });
};