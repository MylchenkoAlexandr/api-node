const router = require('express').Router();
const { getRecords, getRecordsListFromTwilio } = require('../app/controller/record');

router.post('/', getRecords);

// router.post('/create', createRecord);

module.exports = router;