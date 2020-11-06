const AutoDiallerFacade = require('../facades/autodialler.facade');

class AutoDiallerController {
    async getLeadIdFromCall(req, res) {
        try {
            if (('field' in req.body) && ('id' in req.body)) {
                const response = await AutoDiallerFacade.getLeadIdFromCall(req.body.field, req.body.id);
                return res.status(response.code).json({ status: response.status, message: response.message, lead_id: response.data });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (err) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw err;
        }
    }
}

module.exports = new AutoDiallerController;