const router = require('express').Router();
const { getRecords } = require('../app/controller/record');

router.get('/get', getRecords);
// router.post('/fetch-records', fetchCompanyListFromNinjaQuoter);

module.exports = router;