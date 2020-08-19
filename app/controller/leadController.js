const NinjaQuoterService = require('../services/NinjaQuoterService')

async function create(req, res) {
    const quotes = new NinjaQuoterService({
        mutual_omaha: 0,
        liberty_bankers: 0,
        royal_neighbors: 0
    }, {
        birthdate: '1956-05-23',
        smoker: true,
        rate_class: 'lb',
        term: 'fex',
        coverage: 10000,
        state: 'CO',
        gender: "m"
    });

    const price = await quotes.getQuotes();
    res.send(price);
}

module.exports = {
    create
}   