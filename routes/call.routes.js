const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const CallController = require('../app/controller/call.controller');

router.get('/token', authenticateToken, CallController.token);
router.post('/voice', CallController.voice);
router.post('/record-callback/:lead_id/:user_id', CallController.recordCallback);
router.post('/play/pre-recorded-vm', CallController.playPreRecordedVM);
router.post('/recieve-voicemail/:lead_id', CallController.recieveVoiceMail);
router.post('/transcription-callback', CallController.transcriptionCallback);
router.post('/inbound-call', CallController.inboundCall);
router.post('/voicemail-response', CallController.voiceMailResponce);

module.exports = router;