const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AgentService = require('../services/agent.service');

async function login(req, res) {
  try {
    const user = await AgentService.find(req.body.email);

    if (user) {
      const password_mathes = await bcrypt.compare(req.body.password, user.password);

      if (password_mathes) {
        const acces_token = jwt.sign({ data: req.body.email }, process.env.SECRET_KEY, { expiresIn: "24h" });

        return res.status(200).json({
          status: "success",
          message: "Login success",
          user: {
            id: user.id,
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            states: JSON.parse(user.states),
            role_id: user.role_id
          },
          token: acces_token
        });
      }
    }

    return res.status(401).json({ status: 'error', message: "Password or email incorrect" });
  } catch (error) {
    res.status(400).json({ status: 'error', message: "Server error" });
    throw error;
  }

};

async function verify(req, res) {
  const jwt_token = req.body.token;

  if (!jwt_token) {
    return res.status(401).json({ status: 'error', message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(jwt_token, process.env.SECRET_KEY);
    const account_banned = await AgentService.checkedBan(decoded.data);

    if (account_banned) {
      return res.status(403).json({ status: 'error', message: "Your account has been banned" });
    }

    const candidate = await AgentService.find(decoded.data);

    return res.status(200).json({
      status: "success",
      message: "Verify success",
      user: {
        id: candidate.id,
        email: candidate.email,
        fname: candidate.fname,
        lname: candidate.lname,
        states: JSON.parse(candidate.states),
        role_id: candidate.role_id
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: "Server error" });
    throw error;
  }
}

module.exports = {
  login,
  verify
}