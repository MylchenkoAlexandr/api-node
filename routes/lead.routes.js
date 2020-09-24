const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/auth.middleware');
const { test, getLeads, getLead, getCompaniesListByLeadData, uploadLeadFromMediaAlpha, getRawLeads, uploadLeadFromUrl } = require('../app/controller/lead.controller');
const { uploadCSV } = require('../app/controller/upload.controller');

router.post('/test', test);
router.post('/get-raws', authenticateToken, getRawLeads);
router.post('/get-lead', authenticateToken, getLead);
router.post('/get-leads', authenticateToken, getLeads);
router.post('/get-companies', getCompaniesListByLeadData);
router.post('/upload/bulk-csv', authenticateToken, uploadCSV)
router.post('/upload/media-alpha', uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', uploadLeadFromUrl);

module.exports = router;