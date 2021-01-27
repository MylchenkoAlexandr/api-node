const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const { voiceMailResponce, playPreRecordedVM, token, inboundCall, voice, recordCallback, transcriptionCallback, recieveVoiceMail } = require('../app/controller/call.controller');

router.get('/token', authenticateToken, token);
router.post('/voice', voice);
router.post('/record-callback/:lead_id/:user_id', recordCallback);
router.post('/play/pre-recorded-vm', playPreRecordedVM);
router.post('/recieve-voicemail/:lead_id', recieveVoiceMail);
router.post('/transcription-callback', transcriptionCallback);
router.post('/inbound-call', inboundCall);

router.post('/voicemail-response', voiceMailResponce);

module.exports = router;