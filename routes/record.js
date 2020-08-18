const router = require('express').Router();
const { fetchRecordsFromTwilioAndSaveToDB } = require('../app/controller/recordController');

router.post('/fetch-records', fetchRecordsFromTwilioAndSaveToDB);

module.exports = router;