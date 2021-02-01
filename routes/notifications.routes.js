const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

const NotificationsController = require('../app/controller/notifications.controller');

router.get("/user/:user_id", authenticateToken, NotificationsController.getNotifications);
router.get("/messages/user/:user_id/lead/:lead_id", authenticateToken, NotificationsController.getMessageNotifications);
router.get("/voicemails/user/:user_id/lead/:lead_id", authenticateToken, NotificationsController.getVoicemailsNotifications);
router.post("/messages/update", authenticateToken, NotificationsController.updateMessageNotification);
router.post("/voicemails/update", authenticateToken, NotificationsController.updateVoicemailNotification);

module.exports = router;