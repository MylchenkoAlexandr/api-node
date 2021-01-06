const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

const MessageController = require('../app/twilio/message/message.controller');

router.get("/lead/:lead_id", authenticateToken, MessageController.allByLeadId);
router.post("/send", authenticateToken, MessageController.saveAndSendMessage);
router.post("/resend", authenticateToken, MessageController.resendMessage);
router.post("/receive", MessageController.receiveMessage);
module.exports = router;

