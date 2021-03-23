const TelcastService = require('./telcast.service');
const LeadRepository = require('../repository/lead.repository');
class TelcastController {
    /**
     * Upload list count of leads to TelcastAPI
     * @param {*} req 
     * @param {*} res 
     */
    async index(req, res) {
        try {
            if (req.body) {
                const leads = req.body;

                leads.forEach(lead => {
                    TelcastService.sendLead(lead);
                });

                return res.status(200).send({ status: "success", message: "Leads sent!" });
            }

            return res.status(400).send({ status: "error", message: "Bad request!" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }
}

module.exports = new TelcastController();