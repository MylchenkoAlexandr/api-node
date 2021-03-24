const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

const MessageController = require('../app/twilio/message/message.controller');

router.get("/lead/:lead_id", authenticateToken, MessageController.allByLeadId);
router.get("/unread/user/:user_id", authenticateToken, MessageController.getUnreadMessages);
router.get("/unread/user/:user_id/lead/:lead_id", authenticateToken, MessageController.getUnreadMessagesByLeadId);
router.post("/read", authenticateToken, MessageController.updateReadStatus);
router.post("/send", authenticateToken, MessageController.saveAndSendMessage);
router.post("/resend", authenticateToken, MessageController.resendMessage);
router.post("/receive", MessageController.receiveMessage);
module.exports = router;

