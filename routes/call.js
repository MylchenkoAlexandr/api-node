const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/authMiddleware');
const { token, voice } = require('../app/controller/callController');

router.get('/token', authenticateToken, token);

router.post('/voice', voice);

module.exports = router;