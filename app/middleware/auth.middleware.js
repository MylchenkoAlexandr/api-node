const jwt = require('jsonwebtoken');
const AgentService = require('../services/agent.service');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    try {
      const account_banned = await AgentService.checkedBan(decoded.data);

      if (err) return res.sendStatus(403);
      if (account_banned) {
        return res.status(403).json({
          status: 'error',
          message: "Your account has been banned"
        });
      }

      next();
    } catch (error) {
      throw new Error(error);
    }
  });
};

const checkBannedAccount = async (req, res, next) => {
  try {
    const account_banned = await AgentService.checkedBan(req.body.email);

    if (account_banned) {
      return res.status(403).json({
        status: 'error',
        message: "Your account has been banned"
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: "Server error"
    });
    throw new Error(error);
  }
}

const checkedAdminRole = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    try {
      const admin_match = await AgentService.checkAdmin(decoded.data);

      if (err) return res.sendStatus(403);
      if (!admin_match) {
        return res.status(401).json({
          status: 'error',
          message: "You have not permission"
        });
      }

      next();
    } catch (error) {
      throw new Error(error);
    }
  });
}

module.exports = {
  authenticateToken,
  checkBannedAccount,
  checkedAdminRole
};