const router = require('express').Router();
const ConferenceController = require('../app/twilio/conference/conference.controller');

router.post("/handle-hold", ConferenceController.handleParticipantHold);
router.post("/remove-participiant", ConferenceController.removeParticipiant);

module.exports = router;