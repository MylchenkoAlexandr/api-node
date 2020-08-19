const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/authMiddleware');
const { fetchRecordsFromTwilioAndSaveToDB } = require('../app/controller/recordController');

router.post('/fetch-records', authenticateToken, fetchRecordsFromTwilioAndSaveToDB);

module.exports = router;