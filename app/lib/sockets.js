const { processLead, processPrice } = require('../services/LeadService');
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
                const lead = await processLead(data[0]);

                if (lead) {
                    const property = JSON.parse(lead.property);
                    const quoterInfo = {
                        birthdate: property.birth_date,
                        smoker: !!+property.tobacco,
                        rate_class: property.rateClass,
                        term: property.term,
                        coverage: property.coverage_amount,
                        state: property.state,
                        gender: property.gender
                    };

                    const quotes = new NinjaQuoterService(preferedCompanies, quoterInfo);
                    const price = await quotes.getPrice();

                    if (price) {
                        console.log("price", price);
                        await processPrice(lead.id, price, "ninjaQuoter");
                    }

                    // socket.emit("UPDATE_LEAD", lead);
                }
            } catch (error) {
                console.log(error);
            }
        });
    });
};