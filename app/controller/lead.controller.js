const client = require('socket.io-client')(process.env.WEBSOCKET_URL);

const FormatService = require('../services/format.service');
const LeadService = require('../services/lead.service');
const NinjaQuoterService = require('../services/ninja-quoter.service');

const MailFacade = require('../facades/mail.facade');

async function test(req, res) {
    const lead = await FormatService.formatLead(req.body);
    return res.status(200).send(lead);
}

async function getLeads(req, res) {
    try {
        const leads = await LeadService.getAll(req.params.type, req.params.user_id);
        return res.status(200).json({ status: "success", leads });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error!" });
        throw err;
    }
}

async function getRawLeads(req, res) {
    try {
        const rawLeads = await LeadService.getRawLeads();
        return res.status(200).json({ status: "success", rawLeads });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw err;
    }
}

async function getLead(req, res) {
    try {
        const lead = await LeadService.getOne(req.params.lead_id);
        return res.status(200).json({ status: "success", lead });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw err;
    }
}

async function getCompaniesListByLeadData(req, res) {
    try {
        const rawLead = JSON.parse(JSON.stringify(req.body));

        rawLead.medications = rawLead['medications[]'];

        if ("medications" in rawLead) {
            delete rawLead['medications[]']
        }

        client.emit("process-lead", rawLead);

        const formatedLeadForQuote = FormatService.formatLeadForQuote(rawLead);
        const quotes = new NinjaQuoterService(formatedLeadForQuote);
        const companies = await quotes.getCompaniesInfo();

        if (
            ("email" in req.body)
            && ("coverage_amount" in req.body)
            && ("term") in req.body
            && companies.length !== 0
        ) {
            try {
                const mail = new MailFacade();
                const email_params = {
                    companies,
                    email: rawLead.email,
                    coverage_amount: rawLead.coverage_amount,
                    term: rawLead.term,
                    contact: rawLead.contact
                }

                mail.sendEmailWithCompanies(email_params);
            } catch (error) {
                console.error(error);
            }
        }

        return res.status(200).json(companies);
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
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
            agent: null,
            type: urlData.type,
            source: "clickListing",
            empty: 1
        };

        if ("first_name" in urlData && "last_name" in urlData) {
            rawLead.fname = urlData.first_name;
            rawLead.lname = urlData.last_name;
        }

        if ("phone" in urlData) {
            rawLead.phone = urlData.phone;
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

        console.log("uploadLeadFromUrl -> rawLead", rawLead)

        client.emit("process-lead", rawLead);

        return res.status(200).json({ status: 'success', message: 'Lead Uploaded' });
    }
    catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
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

        const formatedLeadForQuote = FormatService.formatLeadForQuote(preparedLead);
        const quotes = new NinjaQuoterService(formatedLeadForQuote);
        const companies = await quotes.getCompaniesInfo();

        if (companies.length !== 0 && preparedLead.email.trim() !== '') {
            try {
                const mail = new MailFacade();
                const email_params = {
                    companies,
                    email: preparedLead.email,
                    coverage_amount: formatedLeadForQuote.coverage,
                    term: formatedLeadForQuote.term,
                    contact: preparedLead.contact
                }

                mail.sendEmailWithCompanies(email_params);
            } catch (error) {
                console.error(error);
            }
        }

        return res.status(200).json({ status: "success", message: "Success Uploaded!" });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw err;
    }

}

async function getBlueberryLeads(req, res) {
    try {
        const leads = await LeadService.blueberryLeads();
        return res.status(200).json({ status: "success", leads });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw err;
    }
}

async function getMediaAlphaLeads(req, res) {
    try {
        const leads = await LeadService.mediaAlphaLeads();
        return res.status(200).json({ status: "success", leads });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw err;
    }
}

async function getManualLeads(req, res) {
    try {
        const leads = await LeadService.manualLeads();
        return res.status(200).json({ status: "success", leads });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw err;
    }
}

async function getBulkLeads(req, res) {
    try {
        const leads = await LeadService.bulkLeads();
        return res.status(200).json({ status: "success", leads });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw err;
    }
}

async function getClickListingLeads(req, res) {
    try {
        const leads = await LeadService.clickListingLeads();
        return res.status(200).json({ status: "success", leads });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
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
    uploadLeadFromUrl,
    getBlueberryLeads,
    getMediaAlphaLeads,
    getManualLeads,
    getBulkLeads,
    getClickListingLeads
}   