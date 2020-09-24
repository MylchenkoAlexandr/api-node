const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const LeadRepository = require('../repository/LeadRepository');
const FormatService = require('../services/format.service');
const NinjaQuoterService = require('../services/NinjaQuoterService');
const MailService = require('../services/mail.service');
// const zipcodes = require('zipcodes');
// const { createLead, updateLead } = require('../services/lead.service');
// const models = require('../../database/models')
// const { raw } = require('body-parser');

async function test(req, res) {
    const lead = await FormatService.formatLead(req.body);
    return res.status(200).send(lead);
}

async function getLeads(req, res) {
    try {
        const leads = await LeadRepository.getAll(req.body.type, req.body.states);
        return res.status(200).json(leads);
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: "Server Error!"
        });
        throw err;
    }
}

async function getRawLeads(req, res) {
    try {
        const rowLeads = await LeadRepository.getEmptyAll();
        return res.status(200).json(rowLeads);
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: "Server Error!"
        });
        throw err;
    }
}

async function getLead(req, res) {
    try {
        const lead = await LeadRepository.getOne(req.body.id);
        return res.status(200).json(lead);
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: "Server Error!"
        });
        throw err;
    }
}

async function getCompaniesListByLeadData(req, res) {
    const rawLead = JSON.parse(JSON.stringify(req.body));

    rawLead.medications = rawLead['medications[]'];

    if ("medications" in rawLead) {
        delete rawLead['medications[]']
    }

    client.emit("process-lead", rawLead);

    try {
        const formatedLeadForQuote = await FormatService.formatLeadForQuote(rawLead);

        const quotes = new NinjaQuoterService(formatedLeadForQuote);

        const companies = await quotes.getCompaniesInfo();

        if("email" in rawLead) {
            const html = MailService.generateQuotesHtmlTemplate('quote.ejs', companies);

            const mail_options = {
                from: process.env.MAIL_SERVICE_USER_EMAIL,
                to: rawLead.email,
                subject: "Blueberry Insurance",
                html
            };

            MailService.send(mail_options);
        }

        return res.status(200).json(companies);
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: "Server Error!"
        });
        throw err;
    }
}

async function uploadLeadFromUrl(req, res) {
    try {
        const urlData = req.body;
        let rawLead = {};

        if ("phone" in urlData) {
            rawLead.phone = urlData.phone;
        } else {
            throw new Error('Missed phone number, we use phone number for all opertion, so it`s required field.');
        }

        rawLead = {
            type: urlData.type,
            source: "blueberry",
            empty: 1,
        };

        if ("first_name" in urlData && "last_name" in urlData) {
            rawLead.fname = urlData.first_name;
            rawLead.lname = urlData.last_name;
        }

        if ("email" in urlData) {
            rawLead.email = urlData.email;
        }

        if ("zip" in urlData) {
            rawLead.zip = urlData.zip;
        }

        if ("dob" in urlData) {
            rawLead.birth_date = urlData.dob;
        }

        client.emit("process-lead", rawLead);

        // client.emit('raw-leads', [processedLead.id]);
        return res.status(400).json({
            status: 'success',
            message: 'Lead Uploaded'
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'error',
            message: "Server Error!"
        });
        throw err;
    }
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
        res.status(400).json({
            status: 'error',
            message: "Server Error!"
        });
        throw err;
    }

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