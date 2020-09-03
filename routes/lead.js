const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/authMiddleware');
const { test, getLeads, getLead, getCompaniesListByLeadData, uploadLeadFromMediaAlpha, uploadLeadFromUrl } = require('../app/controller/leadController');
const { uploadCSV } = require('../app/controller/uploadController');

router.post('/get-leads', authenticateToken, getLeads);
router.post('/get-lead', authenticateToken, getLead);
router.post('/get-companies', getCompaniesListByLeadData);
router.post('/upload/media-alpha', uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', authenticateToken, uploadLeadFromUrl);
router.post('/upload/bulk-csv', authenticateToken, uploadCSV)
router.post('/test', test);

module.exports = router;