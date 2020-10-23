const router = require('express').Router();
const UserController = require('../app/controller/user.controller');

router.put("/active", UserController.active);
// router.post('/outbound-call', TwilioController.outboundCall);
// router.post('/amd', TwilioController.AMD);

module.exports = router;