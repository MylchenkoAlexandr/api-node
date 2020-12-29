const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

const MessageController = require('../app/twilio/message/message.controller');

// router.get("/all", authenticateToken);
router.post("/send", authenticateToken, MessageController.saveAndSendMessage);

module.exports = router;

