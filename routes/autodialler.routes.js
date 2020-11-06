const router = require('express').Router();
const AutoDiallerController = require('../app/controller/autodialler.controller');

router.post('/get-lead-id', AutoDiallerController.getLeadIdFromCall);

module.exports = router;