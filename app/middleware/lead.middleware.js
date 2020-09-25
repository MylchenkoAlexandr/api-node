const LeadService = require('../services/lead.service');

class LeadMiddleware {
    async checkAssignAgentLead(req, res, next) {
        try {
            const access = await LeadService.agentIsAssigned(req.body.lead_id, req.body.user_id);

            if (access) {
                return next();
            }

            res.sendStatus(423);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new LeadMiddleware;