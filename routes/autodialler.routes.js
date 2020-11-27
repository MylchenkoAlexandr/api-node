const router = require('express').Router();
const AutoDiallerController = require('../app/controller/autodialler.controller');

router.post('/get-lead-id', AutoDiallerController.getLeadIdFromCall);
router.post('/one-by-one', AutoDiallerController.callOneByOne);
router.post('/callback/one-by-one', AutoDiallerController.callBackOneByOne);
router.post('/transfer-to-Agent', AutoDiallerController.transferCallToAgent);

module.exports = router;