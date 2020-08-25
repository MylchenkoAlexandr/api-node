const models = require('../../database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  try {
    const user = await models.Users.findOne({
      where: { email: req.body.email }
    });

    if (user) {
      const passwordCorrect = await bcrypt.compare(req.body.password, user.password);

      if (passwordCorrect) {
        let accesToken = jwt.sign({ data: req.body.email }, process.env.SECRET_KEY, { expiresIn: "24h" });

        return res.status(200).json({
          message: "Login success",
          user: {
            id: user.id,
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            states: JSON.parse(user.states),
            role_id: user.role_id
          },
          token: accesToken
        });
      }
    }

    return res.status(200).json({ message: "Password or email incorrect" });
  } catch (error) {
    console.log(error);
  }

  return res.status(400).json({ message: "Sign In error" });
};

async function registration(req, res) {
  try {
    const user = await models.Users.findOne({
      where: { email: req.body.email }
    });

    if (!user) {
      const hash = await bcrypt.hash(req.body.password, 10);

      const user = await models.Users.create({
        role_id: req.body.role,
        email: req.body.email,
        name: req.body.name,
        password: hash,
        states: req.body.states
      })

      if (user) return res.status(201).json({ message: "User registration" });
    }

    return res.status(200).json({ message: "User exist" });
  } catch (error) {
    console.log(error);
  }

  return res.status(400).json({ message: "Sign Up error" });
};

async function verify(req, res) {
  try {
    const decoded = jwt.decode(req.body.token, process.env.SECRET_KEY);

    const candidate = await models.Users.findOne({
      where: { email: decoded.data }
    });

    if (candidate) {
      const user = candidate.dataValues;

      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          states: JSON.parse(user.states),
          role_id: user.role_id
        }
      })
    }

    return res.status(401).json({ message: "Token not found" });

  } catch (error) {
    console.log(error);
  }

  return res.status(401).json({ message: "Verify error" });
}

module.exports = {
  login,
  registration,
  verify
}