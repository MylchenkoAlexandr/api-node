const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const VoiceMailsController = require("../app/twilio/voicemails/voicemails.controller");
const CustomersVMController = require('../app/twilio/voicemails/customers/voicemail.controller');

router.get("/:user_id", authenticateToken, VoiceMailsController.get)
router.get("/customers/:lead_id", authenticateToken, CustomersVMController.get)
router.get("/not-listened/user/:user_id", authenticateToken, CustomersVMController.getNotListenedCustomerVM);
router.post("/create", authenticateToken, VoiceMailsController.create);
router.post("/delete", authenticateToken, VoiceMailsController.delete);

module.exports = router;