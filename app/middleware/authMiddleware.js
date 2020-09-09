const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.sendStatus(403);
    console.log(decoded);
    next();
  });
};

module.exports = {
  authenticateToken
};