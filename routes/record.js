const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/authMiddleware');
const { fetchRecordsFromTwilioAndSaveToDB } = require('../app/controller/recordController');

router.post('/fetch', authenticateToken, fetchRecordsFromTwilioAndSaveToDB);

module.exports = router;