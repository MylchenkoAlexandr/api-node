const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/auth.middleware');
const { getLeads, getLead, getCompaniesListByLeadData, uploadLeadFromMediaAlpha, getRowLeads, uploadLeadFromUrl } = require('../app/controller/leadController');
const { uploadCSV } = require('../app/controller/uploadController');

router.post('/get-rows', authenticateToken, getRowLeads);
router.post('/get-lead', authenticateToken, getLead);
router.post('/get-leads', authenticateToken, getLeads);
router.post('/get-companies', getCompaniesListByLeadData);
router.post('/upload/bulk-csv', authenticateToken, uploadCSV)
router.post('/upload/media-alpha', uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', authenticateToken, uploadLeadFromUrl);

module.exports = router;