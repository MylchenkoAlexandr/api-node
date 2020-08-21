const router = require('express').Router();
const { getCompaniesListByLeadData, processLeadDashoard, uploadLeadFromMediaAlpha, uploadLeadFromUrl } = require('../app/controller/leadController');

router.post('/get-companies', getCompaniesListByLeadData);
router.post('/dashboard/process-lead', processLeadDashoard);
router.post('/upload/media-alpha', uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', uploadLeadFromUrl);

module.exports = router;