const router = require('express').Router();
const ConferenceController = require('../app/twilio/conference/conference.controller');

router.post("/add-participiant", ConferenceController.addParticipant);
router.post("/handle-hold", ConferenceController.handleParticipantHold);
router.post("/remove-participiant", ConferenceController.removeParticipiant);
router.post("/participiant-status-callback", ConferenceController.participiantStatusCallback);

module.exports = router;