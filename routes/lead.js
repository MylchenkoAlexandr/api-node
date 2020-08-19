const router = require('express').Router();
const { getCompaniesListByLeadData } = require('../app/controller/leadController');

router.post('/get-companies', getCompaniesListByLeadData);

// router.post('/create', create);

module.exports = router;