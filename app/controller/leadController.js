const NinjaQuoter = require('../services/ninjaQuoter')

async function create(req, res) {
    const quotes = new NinjaQuoter(['valera']);
    console.log(await quotes.filteredCompanies());
}

module.exports = {
    create
}   