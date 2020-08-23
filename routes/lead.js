const router = require('express').Router();
const { getLeads, getCompaniesListByLeadData, processLeadDashoard, uploadLeadFromMediaAlpha, uploadLeadFromUrl } = require('../app/controller/leadController');

router.post('/get-leads', getLeads);
router.post('/get-companies', getCompaniesListByLeadData);
router.post('/dashboard/process-lead', processLeadDashoard);
router.post('/upload/media-alpha', uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', uploadLeadFromUrl);

module.exports = router;