const models = require('../database/models');
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

        res.status(200).json({
          message: "Login success",
          user: {
            email: user.email,
            name: user.name,
            role_id: user.role_id
          },
          token: accesToken
        });
      } else {
        res.status(200).json({ message: "Password or email incorrect" });
      }
    } else {
      res.status(200).json({ message: "Password or email incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Sign In error" });
  }
};

async function registration(req, res) {
  try {
    const user = await models.Users.findOne({
      where: { email: req.body.email }
    });

    if (!user) {
      const hash = await bcrypt.hash(req.body.password, 10);

      await models.Users.create({
        role_id: req.body.role,
        email: req.body.email,
        name: req.body.name,
        password: hash,
        states: req.body.states
      })

      res.status(201).json({ message: "User registration" })
    } else {
      res.status(200).json({ message: "User exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Sign Up error" });
  }
};

module.exports = {
  login,
  registration
}