const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/authMiddleware');
const { token, voice, recordCallback } = require('../app/controller/callController');

router.get('/token', authenticateToken, token);

router.post('/voice', voice);

router.post('/record-callback/:lead_id/:user_id', recordCallback);

module.exports = router;