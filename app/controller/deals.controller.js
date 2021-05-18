const DealsService = require("../services/deals.service");

class DealsController {
    async getDeals(req, res) {
        try {
            if (req.body.filters) {
                const info = await DealsService.getDeals(req.body.filters);
                return res.status(200).send({ status: "success", message: "Success!", deals: info });
            }
            return res.status(400).send({ status: "error", message: "Bad request!" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }
}

module.exports = new DealsController();