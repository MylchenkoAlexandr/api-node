const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const { token, voice, recordCallback, transcriptionCallback } = require('../app/controller/call.controller');

router.get('/token', authenticateToken, token);
router.post('/voice', voice);
router.post('/record-callback/:lead_id/:user_id', recordCallback);
router.post('/transcription-callback', transcriptionCallback);

module.exports = router;