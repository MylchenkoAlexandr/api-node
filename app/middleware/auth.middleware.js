const jwt = require('jsonwebtoken');
const AgentService = require('../services/agent.service');

class AuthMiddleware {

  authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(400).json({ status: 'error', message: 'Bad Request' });

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      try {
        if (err) return res.status(403).json({ status: "error", message: "Not authorization user" });

        const account_banned = await AgentService.checkedBan(decoded.data);
        if (account_banned) return res.status(403).json({ status: 'error', message: "Your account has been banned" });

        next();
      } catch (error) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw error;
      }
    });
  }

  checkedAdminRole(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(400).json({ status: 'error', message: 'Bad Request' });

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      try {
        if (err) return res.status(403).json({ status: "error", message: "Not authorization user" });

        const admin_match = await AgentService.checkAdmin(decoded.data);
        if (admin_match) return next();

        return res.status(401).json({ status: 'error', message: "You have not permission" });
      } catch (error) {
        res.status(500).json({ status: 'error', message: "Server Error" });
        throw error;
      }
    });
  }
}

module.exports = new AuthMiddleware;