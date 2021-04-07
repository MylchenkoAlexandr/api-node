const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const FormatService = require('../services/format.service');
const LeadFacade = require('../facades/lead.facade');
const LeadService = require('../services/lead.service');
const models = require('../../database/models');
const leadService = require('../services/lead.service');
const LeadRepository = require('../repository/user.repository');
async function test(req, res) {
    await LeadRepository.findSuitableAgent(6);
    return res.status(200);

}

async function getAll(req, res) {
    try {
        const response = await LeadFacade.getAll();
        return res.status(response.code).json({ status: response.status, leads: response.leads });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error!" });
        throw err;
    }
}

async function getAllLeadsForGuide(req, res) {
    try {
        const response = await LeadService.getSuitableLeadsForCall();
        return res.status(200).json({ status: "Success", leads: response });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error!" });
        throw err;
    }
}

async function getLeads(req, res) {
    try {
        const response = await LeadFacade.getAllLeads(req.params.type, req.params.user_id);
        return res.status(response.code).json({ status: response.status, leads: response.leads });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error!" });
        throw err;
    }
}

async function getRawLeads(req, res) {
    try {
        const response = await LeadFacade.getRawLeads();
        return res.status(response.code).json({ status: response.status, rawLeads: response.leads });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw err;
    }
}

async function getLead(req, res) {
    try {
        const response = await LeadFacade.getOneLead(req.params.lead_id);
        return res.status(response.code).json({ status: response.status, lead: response.lead });
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

        const companies = await LeadFacade.getCompaniesList(rawLead);

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

        return res.status(200).json({ status: "success", message: "Success Uploaded!" });
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw err;
    }
}

async function getLeadsBySource(req, res) {
    try {
        const response = await LeadFacade.getLeadsBySource(req.params.source);
        return res.status(response.code).json({ status: response.status, leads: response.leads });
    } catch (error) {
        throw error;
    }
}

async function getLeadsByFilters(req, res) {
    try {
        const response = await LeadFacade.getLeadsByFilters(req.body);

        return res.status(response.code).json({ status: response.status, leads: response.leads });
    } catch (error) {
        throw error;
    }
}

async function deteleLead(req, res) {
    try {
        if ("lead_id" in req.body) {
            const lead_id = req.body.lead_id;
            await LeadService.deleteLead(lead_id);
            client.emit("delete_lead", lead_id);
            return res.status(200).send({ status: "success", message: "Lead deleted" });
        }
        return res.status(400).send({ status: "error", message: "Bad request" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Server error" });
        throw error;
    }
}

function deleteSelectedLeads(req, res) {
    try {
        if (req.body.leads) {
            req.body.leads.forEach(async (item) => {
                await LeadService.deleteLead(item.id);
                client.emit("delete_lead", item.id);
            });
            return res.status(200).send({ status: "success", message: "Leads Deleted!" });
        }
        return res.status(400).send({ status: "error", message: "Bad request!" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Server error!" });
        throw error;
    }
}

async function selectCarrier(req, res) {
    try {
        if (req.body.lead_id && req.body.carrier) {
            const price = await models.Prices.findOne({
                where: {
                    lead_id: req.body.lead_id
                }
            });

            let updatedCarrier = {};

            updatedCarrier[req.body.carrier] = price.price[req.body.carrier];
            if (updatedCarrier[req.body.carrier]) {
                price.update({
                    premium_carrier: JSON.stringify(updatedCarrier)
                });

                client.emit("update_carrier", req.body.lead_id, updatedCarrier);
            }

            return res.status(200).send({ status: "status", message: "Success!" });
        }
        return res.status(400).send({ status: "error", message: "Bad request!" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Server error!" });
        throw error;
    }
}

/**
 * Function for unassign leads from the selected aggents 
 * @param {*} req 
 * @param {*} res 
 */
async function assign(req, res) {
    try {
        if (req.body.leads) {
            const data = req.body;

            for (const [index, lead] of Object.entries(data.leads)) {
                client.emit("assign-agent", lead.id, data.agent);
            }

            return res.status(200).json({ status: "success", message: "Leads unassigned!" });
        }
        return res.status(400).json({ status: "error", message: "Bad request!" });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Server error!" });
        throw err;
    }
}

module.exports = {
    test,
    getLead,
    getAll,
    getLeads,
    getRawLeads,
    getCompaniesListByLeadData,
    uploadLeadFromMediaAlpha,
    uploadLeadFromUrl,
    getLeadsBySource,
    getAllLeadsForGuide,
    getLeadsByFilters,
    deteleLead,
    deleteSelectedLeads,
    selectCarrier,
    assign
}