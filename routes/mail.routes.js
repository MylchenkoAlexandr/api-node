const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const { sendMailToClient, createToken, sendEmailWithCompanies } = require('../app/controller/mail.controller');

router.post('/send', sendMailToClient);
router.post('/send/companies', sendEmailWithCompanies);
router.post('/create', createToken);

module.exports = router;