const NinjaQuoterService = require('../services/NinjaQuoterService')
const { createLead, updateLead } = require('../services/LeadService');
const zipcodes = require('zipcodes');
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const models = require('../../database/models')
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
    const lead = await FormatService.formatLead(req.body);
    return res.status(200).send(lead);
}

async function getLeads(req, res) {
    try {
        const leads = await LeadRepository.getAll(req.body.type, req.body.states);
        return res.status(200).json(leads);
    } catch (err) {
        throw err;
    }

    return res.status(400).json({
        status: 'failed',
        message: "Server error!"
    });
}

async function getRawLeads(req, res) {
    try {
        const rowLeads = await LeadRepository.getEmptyAll();
        return res.status(200).json(rowLeads);
    } catch (err) {
        console.error(err);
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
    const urlParams = req.body;

    const type = await models.Types.findOne({
        parameters: ['id'],
        where: {
            name: urlParams.type
        }
    });

    let rawLead = {
        status: 1,
        empty: 1,
        source: 2,
        type: type.id,
        property: {
            status: "new",
            type: "auto",
            source: "mediaalpha",
        }
    }

    if (urlParams.first_name && urlParams.last_name) {
        rawLead.property.contact = urlParams.first_name + ' ' + urlParams.last_name;
    }
    if (urlParams.phone) {
        rawLead.property.phone = urlParams.phone;
    }
    if (urlParams.email) {
        rawLead.property.email = urlParams.email;
    }
    if (urlParams.zip) {
        rawLead.property.zipcode = urlParams.zip;
        rawLead.property.state = zipcodes.lookup(urlParams.zip).state;
    }
    if (urlParams.dob) {
        rawLead.property.dob = urlParams.dob;
    }

    let processedLead = false;

    if (rawLead.property.email) {
        let leadExist = await models.Leads.findOne({
            where: {
                email: rawLead.property.email
            }
        });

        if (leadExist) {
            processedLead = await updateLead(leadExist, rawLead, "ninjaQuoter", null);

        } else {
            processedLead = await createLead(rawLead, "ninjaQuoter", null);
        }
    } else {
        processedLead = await createLead(rawLead, "ninjaQuoter", null);
    }

    if (processedLead)
        client.emit('raw-leads', [processedLead.id]);

    return res.status(400).json({
        status: 'failed',
        message: 'Server Error!'
    });
}

async function uploadLeadFromMediaAlpha(req, res) {
    try {
        const rawLead = req.body;

        const preparedLead = {
            source: "mediaalpha",
            type: rawLead.type,
            empty: 0,
            ...rawLead.lead
        };

        client.emit("process-lead", preparedLead);

        return res.status(200).json({
            status: "success",
            message: "Success Uploaded!"
        });
    } catch (err) {
        throw err;
    }

    return res.status(400).json({
        status: 'failed',
        message: "Server Error!"
    });
}

module.exports = {
    test,
    getLead,
    getLeads,
    getRawLeads,
    getCompaniesListByLeadData,
    uploadLeadFromMediaAlpha,
    uploadLeadFromUrl
}   