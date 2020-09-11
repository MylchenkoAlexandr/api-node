const AgentService = require('../services/agent.service');

const checkBannedAccount = async (req, res, next) => {
    try {
        const account_banned = await AgentService.checkedBan(req.body.email);

        if (account_banned) {
            res.status(403).json({
                status: 'failed',
                message: "Your account has been banned"
            });
        } else {
            next();
        }
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: "Server error"
        });
        throw new Error(error);
    }
}

module.exports = {
    checkBannedAccount
}