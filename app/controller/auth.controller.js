const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AgentService = require('../services/agent.service');

async function login(req, res) {
  try {
    if (("email" in req.body) && ("password" in req.body)) {
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
        return res.status(401).json({ status: 'error', message: "Password or email incorrect" });
      }
    }

    return res.status(401).json({ status: 'error', message: "Password or email incorrect" });
  } catch (error) {
    res.status(400).json({ status: 'error', message: "Server error" });
    throw error;
  }

};

function verify(req, res) {

  if (!("token" in req.body)) {
    return res.status(403).json({ status: 'error' });
  }

  try {
    const jwt_token = req.body.token;

    jwt.verify(jwt_token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) return res.status(403).json({ status: 'error' });

      const account_banned = await AgentService.checkedBan(decoded.data);
      if (account_banned) return res.status(403).json({ status: 'error', message: "Your account has been banned" });

      const candidate = await AgentService.find(decoded.data);
      if (candidate) {
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
      }

      return res.status(403).json({ status: 'error' });
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