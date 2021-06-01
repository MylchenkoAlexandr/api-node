const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

const CallController = require('../app/twilio/call/call.controller');

router.post('/token/:agent_id', authenticateToken, CallController.token);
router.post('/voice', CallController.voice);
router.post('/record-callback/:lead_id/:user_id', CallController.recordCallback);
router.post('/recieve-voicemail/:lead_id', CallController.recieveVoiceMail);
router.post('/transcription-callback', CallController.transcriptionCallback);
router.post('/inbound-call', CallController.inboundCall);
router.post('/voicemail-response', CallController.voiceMailResponce);
router.post('/customer-status-callback/:user_id', CallController.customerStatusCallback);

const ConferenceController = require('../app/twilio/conference/conference.controller');

router.post("/conference/add-participiant", ConferenceController.addParticipant);
router.post("/conference/handle-hold", ConferenceController.handleParticipantHold);
router.post("/conference/remove-participiant", ConferenceController.removeParticipiant);
router.post("/conference/participiant-status-callback/:user_id", ConferenceController.participiantStatusCallback);

module.exports = router;