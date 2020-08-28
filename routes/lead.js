const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/authMiddleware');
const { test, getLeads, getLead, getCompaniesListByLeadData, processLeadDashoard, uploadLeadFromMediaAlpha, uploadLeadFromUrl } = require('../app/controller/leadController');

router.post('/get-leads', getLeads);
router.post('/get-lead', getLead);
router.post('/get-companies', getCompaniesListByLeadData);
router.post('/dashboard/process-lead', processLeadDashoard);
router.post('/upload/media-alpha', uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', uploadLeadFromUrl);
router.post('/test', test);

module.exports = router;