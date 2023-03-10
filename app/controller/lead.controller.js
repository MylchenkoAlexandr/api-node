const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const LeadService = require('../services/lead.service');
const models = require('../../database/models');

class LeadController {
    async getLeads(req, res) {
        try {
            const response = await LeadService.getAllLeads(req.params.type, req.params.user_id);

            if (response) {
                return res.status(200).json({ status: "success", message: "Success Uploaded!", leads: response });
            }

            return res.status(400).json({ status: "error", message: "Bad request!" });
        } catch (err) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw err;
        }
    }

    async getRawLeads(req, res) {
        try {
            const response = await LeadService.getRawLeads();

            if (response) {
                return res.status(200).json({ status: "success", message: "Success Uploaded!", rawLeads: response });
            }

            return res.status(400).json({ status: "error", message: "Bad request!" });
        } catch (err) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw err;
        }
    }

    async getLead(req, res) {
        try {
            const response = await LeadService.getOne(req.params.lead_id);

            if (response) {
                return res.status(200).json({ status: "success", message: "Success Uploaded!", lead: response });
            }

            return res.status(400).json({ status: "error", message: "Bad request!" });
        } catch (err) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw err;
        }
    }

    async getCompaniesListByLeadData(req, res) {
        try {
            const rawLead = JSON.parse(JSON.stringify(req.body));

            rawLead.medications = rawLead['medications[]'];

            if ("medications" in rawLead) {
                delete rawLead['medications[]']
            }

            rawLead.doNotUpdate = true;

            client.emit("process-lead", rawLead);

            const companies = await LeadService.getCompaniesList(rawLead);

            return res.status(200).json(companies);
        } catch (err) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw err;
        }
    }

    async uploadLeadFromUrl(req, res) {
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

    async uploadLeadFromMediaAlpha(req, res) {
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

    async getLeadsBySource(req, res) {
        try {
            const response = await LeadService.getLeadsBySource(req.params.source);
            if (response) {
                return res.status(200).json({ status: "success", message: "Success Uploaded!", leads: response });
            }

            return res.status(400).json({ status: "error", message: "Bad request!" });
        } catch (err) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw err;
        }
    }

    async getLeadsByFilters(req, res) {
        try {        
            const response = await LeadService.getLeadsByFilters(req.body.params, req.body.limit, req.body.page);
            if (response) {
                return res.status(200).json({ status: "success", message: "Success Uploaded!", leads: response.leads, totalCount: response.totalCount });
            }

            return res.status(400).json({ status: "error", message: "Bad request!" });
        } catch (err) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw err;
        }
    }

    async detele(req, res) {
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

    deleteSelectedLeads(req, res) {
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

    async selectCarrier(req, res) {
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

    async assign(req, res) {
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
}


module.exports = new LeadController;