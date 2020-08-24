const NinjaQuoterService = require('../services/NinjaQuoterService')
const { getLead, processLead, processPrice } = require('../services/LeadService');
const zipcodes = require('zipcodes');
const models = require('../../database/models/index');
const LeadRepository = require('../repository/LeadRepository');

const preferedCompanies = {
    mutual_omaha: 0,
    royal_neighbors: 0,
    liberty_bankers: 0
};

async function test(req, res) {
    const leads = await LeadRepository.getAll();
    const lead = await LeadRepository.getOne(2);

    return res.status(200).json(lead);
}

async function getLeads(req, res) {
    try {
        const leads = await LeadRepository.getAll(req.body.type, req.body.states);
        return res.status(200).json(leads);
    } catch (error) {
        console.error(error);
    }

    return res.status(400).json({
        status: 'failed',
        message: "Server error!"
    });
}

// TODO Remove same code reusing in all function 
async function getCompaniesListByLeadData(req, res) {
    const rowLead = req.body;

    const quoterInfo = {
        birthdate: rowLead.birth_date,
        smoker: rowLead.tobacco,
        rate_class: rowLead.rateClass,
        term: rowLead.term,
        coverage: rowLead.coverage_amount,
        state: rowLead.state,
        gender: rowLead.gender
    };

    const quotes = new NinjaQuoterService(preferedCompanies, quoterInfo);

    try {
        const lead = await processLead(rowLead);

        const companies = await quotes.getCompaniesInfo();

        const price = await quotes.getPrice();

        await processPrice(lead.id, price, "ninjaQuoter");

        return res.status(200).json(companies);
    } catch (error) {
        console.error(error)
    }

    return res.status(400).json({
        status: 'failed',
        message: "Server Error!"
    });
}

// TODO remove code dublicate 
async function processLeadDashoard(req, res) {
    const rowLead = req.body;

    if (rowLead.coverage_type) {
        switch (rowLead.coverage_type) {
            case 'Term 10 Years':
                rowLead.coverage_type = '10';
                break;
            case 'Term 15 Years':
                rowLead.coverage_type = '15';
                break;
            case 'Term 20 Years':
                rowLead.coverage_type = '20';
                break;
            case 'Term 25 Years':
                rowLead.coverage_type = '25';
                break;
            case 'Term 30 Years':
                rowLead.coverage_type = '30';
                break;
            case 'Final Expense':
                rowLead.coverage_type = 'fex';
                break;
        }
    }

    if (rowLead.state == undefined) {
        getZipCodeInfo = zipcodes.lookup(rowLead.zipcode || rowLead.zip)

        rowLead.state = getZipCodeInfo.state
    }

    const quoterInfo = {
        birthdate: rowLead.birth_date,
        smoker: rowLead.tobacco == "1" ? true : false,
        term: rowLead.term || rowLead.coverage_type,
        rate_class: rowLead.rateClass || rowLead.rateClass == 'fex' ? 'lb' : 's',
        coverage: rowLead.coverage_amount,
        state: rowLead.state,
        gender: rowLead.gender.toLowerCase()
    };

    const quotes = new NinjaQuoterService(preferedCompanies, quoterInfo);

    try {
        const lead = await processLead(rowLead, null);

        const price = await quotes.getPrice();

        console.log("processLeadInDashoard -> price", price)

        await processPrice(lead.id, price, "ninjaQuoter");

        return res.status(200).json({
            status: "success",
            message: "Success update!"
        });
    } catch (error) {
        console.error(error)
    }

    return res.status(400).json({
        status: 'failed',
        message: "Server Error!"
    });
}

// TODO write function for fetching data from url
async function uploadLeadFromUrl(req, res) {
    const rowLead = req.body;

    console.log("uploadLeadFromUrl -> rowLead", rowLead)

    rowLead.status = "new";
    rowLead.source = "blueberry";

    try {
        await processLead(rowLead);
        return res.status(200).json({
            status: 'success',
            message: 'Success Uploaded!'
        });
    } catch (error) {
        console.error(error);
    }

    return res.status(400).json({
        status: 'failed',
        message: 'Server Error!'
    });
}

// TODO resolve all issues with type
async function uploadLeadFromMediaAlpha(req, res) {
    const rowLead = req.body;

    rowLead.type = "life";
    rowLead.status = "new";
    rowLead.source = "mediaalpha"

    switch (rowLead.coverage_type) {
        case 'Term 10 Years':
            rowLead.coverage_type = '10';
            break;
        case 'Term 15 Years':
            rowLead.coverage_type = '15';
            break;
        case 'Term 20 Years':
            rowLead.coverage_type = '20';
            break;
        case 'Term 25 Years':
            rowLead.coverage_type = '25';
            break;
        case 'Term 30 Years':
            rowLead.coverage_type = '30';
            break;
        case 'Final Expense':
            rowLead.coverage_type = 'fex';
            break;
    }

    if (rowLead.state == undefined) {
        getZipCodeInfo = zipcodes.lookup(rowLead.zipcode || rowLead.zip)

        rowLead.state = getZipCodeInfo.state
    }

    const quoterInfo = {
        birthdate: rowLead.birth_date,
        smoker: rowLead.tobacco == "1" ? true : false,
        term: rowLead.coverage_type,
        rate_class: rowLead.coverage_type == 'fex' ? 'lb' : 's',
        coverage: rowLead.coverage_amount,
        state: rowLead.state,
        gender: rowLead.gender.toLowerCase()
    };

    const quotes = new NinjaQuoterService(preferedCompanies, quoterInfo);

    try {
        const lead = await processLead(rowLead);

        const price = await quotes.getPrice();

        await processPrice(lead.id, price, "ninjaQuoter");

        return res.status(200).json({
            status: "success",
            message: "Success Uploaded!"
        });
    } catch (error) {
        console.error(error)
    }

    return res.status(400).json({
        status: 'failed',
        message: "Server Error!"
    });
}

module.exports = {
    getLeads,
    getCompaniesListByLeadData,
    processLeadDashoard,
    uploadLeadFromMediaAlpha,
    uploadLeadFromUrl,
    test
}   