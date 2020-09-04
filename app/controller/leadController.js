const NinjaQuoterService = require('../services/NinjaQuoterService')
const { processLead, processPrice } = require('../services/LeadService');
const zipcodes = require('zipcodes');
const LeadRepository = require('../repository/LeadRepository');

const preferedCompaniesFEX = {
    mutual_omaha: 0,
    royal_neighbors: 0,
    liberty_bankers: 0,
};

const preferedCompanies = {
    mutual_omaha_express: 0,
    foresters_express: 0,
    sagicor_express_issue: 0,
    american_general: 0
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

async function getLead(req, res) {
    try {
        const lead = await LeadRepository.getOne(req.body.id);
        return res.status(200).json(lead);
    } catch (error) {
        console.error(error);
    }
}

// TODO Remove same code reusing in all function 
async function getCompaniesListByLeadData(req, res) {
    const rowLead = req.body;

    const quoterInfo = {
        birthdate: rowLead.birthdate,
        smoker: Boolean(+rowLead.tobacco),
        term: rowLead.term,
        rate_class: rowLead.term == 'fex' ? 'lb' : 's',
        coverage: rowLead.coverage_amount,
        state: rowLead.state,
        gender: rowLead.gender
    };

    const quotes = new NinjaQuoterService(quoterInfo.term == 'fex' ? preferedCompaniesFEX : preferedCompanies, quoterInfo);

    try {
        const companies = await quotes.getCompaniesInfo();

        return res.status(200).json(companies);
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
    try {
        let rowLead = req.body.lead;

        switch (rowLead.coverage_type) {
            case 'Term 10 Years':
                rowLead.term = '10';
                break;
            case 'Term 15 Years':
                rowLead.term = '15';
                break;
            case 'Term 20 Years':
                rowLead.term = '20';
                break;
            case 'Term 25 Years':
                rowLead.term = '25';
                break;
            case 'Term 30 Years':
                rowLead.term = '30';
                break;
            case 'Final Expense':
                rowLead.term = 'fex';
                break;
        }

        rowLead.rateClass = rowLead.term == 'fex' ? 'lb' : 's';

        rowLead.state = zipcodes.lookup(rowLead.zipcode || rowLead.zip).state

        rowLead.gender = rowLead.gender.toLowerCase()

        let preparedLead = {
            type: req.body.type,
            ...rowLead,
        }

        rowLead.status = "new";
        rowLead.source = "mediaalpha"

        rowLead.tobacco = rowLead.tobacco == "1" ? true : false

        // const quoterInfo = {
        //     birthdate: rowLead.birth_date,
        //     smoker:,
        //     term: rowLead.term || rowLead.coverage_type,

        
        // };

        // const quotes = new NinjaQuoterService(rowLead.term == 'fex' ? preferedCompaniesFEX : preferedCompanies, quoterInfo);

        try {
                    
        } catch (error) {
            console.error(error)
        }

        return res.status(200).json({
            status: "success",
            message: "Success Uploaded!"
        });
    } catch (e) {
        console.error(e);
    }

    return res.status(400).json({
        status: 'failed',
        message: "Server Error!"
    });
}

module.exports = {
    getLeads,
    getCompaniesListByLeadData,
    uploadLeadFromMediaAlpha,
    uploadLeadFromUrl,
    test,
    getLead
}   