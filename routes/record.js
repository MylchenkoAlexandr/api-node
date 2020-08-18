const router = require('express').Router();
const { fetchRecordsFromTwilioAndSaveToDB } = require('../app/controller/record');

router.post('/fetch-records', fetchRecordsFromTwilioAndSaveToDB);

module.exports = router;