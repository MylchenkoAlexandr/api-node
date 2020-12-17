const LeadService = require('../services/lead.service');
const AgentService = require('../services/agent.service');
const jwt = require('jsonwebtoken');

class LeadMiddleware {
    checkAssignAgentLead(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            try {
                if (err) return res.status(403).json({ status: "error", message: "Not authorization user" });

                const user = await AgentService.find(decoded.data);
                
                if(user.role_id == 3) return next()

                const access = await LeadService.agentIsAssigned(req.params.lead_id, user.id);

                if (access) return next();
                return res.status(400).json({ status: 'error', message: 'No permission' });
            } catch (error) {
                res.status(500).json({ status: 'error', message: "Server Error" });
                throw error;
            }
        });

    }

    findUncompletedLead(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            try {
                if (err) return res.status(403).json({ status: "error", message: "Not authorization user" });

                const lead_id = await AgentService.uncompletedLead(decoded.data);
                if (lead_id == null || lead_id == req.params.lead_id) return next();

                return res.status(307).json({ status: 'warning', message: 'Please complete this lead, change status', lead_id });
            } catch (error) {
                res.status(500).json({ status: 'error', message: "Server Error" });
                throw error;
            }
        });

    }
}

module.exports = new LeadMiddleware;