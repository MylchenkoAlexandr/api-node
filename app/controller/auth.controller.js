const AuthFacade = require('../facades/auth.facade');

class AuthController {

  async login(req, res) {
    try {
      if (("email" in req.body) && ("password" in req.body)) {
        const response = await AuthFacade.login(req.body.email, req.body.password);

        return res.status(response.code).json({ status: response.status, message: response.message, user: response.user, token: response.token });
      }

      return res.status(400).json({ status: 'error', message: 'Bad Request' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: "Server Error" });
      throw error;
    }
  };

  async verify(req, res) {
    try {
      if (("token" in req.body)) {
        const jwt_token = req.body.token;
        const response = await AuthFacade.verify(jwt_token);

        return res.status(response.code).json({ status: response.status, message: response.message, user: response.user });
      }

      return res.status(400).json({ status: 'error', message: 'Bad Request' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: "Server Error" });
      throw error;
    }
  }
}

module.exports = new AuthController;