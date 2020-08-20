const NinjaQuoterService = require('../services/NinjaQuoterService')
const { processLead, savePrice } = require('../services/LeadService')

async function getCompaniesListByLeadData(req, res) {

    const requstedData = { "source": "blueberry", "type": "life", "birth_date": "2001-05-23", "children": 1, "coverage_amount": 6000, "disability": "1", "email": "test@test.com", "fname": "Test", "gender": "m", "height": 57, "howchildren": null, "insurance": 1, "jobstatus": "3", "lname": "Test", "married": 1, "medications": ["4"], "mortgage": 1, "mortgage_remaining": null, "phone": "(503)336-9814", "policy": 1, "rateClass": "lb", "state": "CO", "term": "fex", "tobacco": true, "total_income": null, "weight": "123", "zipcode": "12321" };

    const preferedCompanies = {
        mutual_omaha: 0,
        royal_neighbors: 0,
        liberty_bankers: 0
    };

    const quoterInfo = {
        birthdate: requstedData.birth_date,
        smoker: requstedData.tobacco,
        rate_class: requstedData.rateClass,
        term: requstedData.term,
        coverage: requstedData.coverage_amount,
        state: requstedData.state,
        gender: requstedData.gender
    };

    const lead = await processLead(requstedData);

    const quotes = new NinjaQuoterService(preferedCompanies, quoterInfo);

    const companies = await quotes.getCompaniesInfo();

    const price = await quotes.getPrice();

    await processPrice(lead.id, price, "ninjaQuoter");

    res.json(companies);
}

module.exports = {
    getCompaniesListByLeadData,
}   