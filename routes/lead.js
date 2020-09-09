const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/authMiddleware');
const { getLeads, getLead, getCompaniesListByLeadData, uploadLeadFromMediaAlpha, getRowLeads, getRowLead, uploadLeadFromUrl } = require('../app/controller/leadController');
const { uploadCSV } = require('../app/controller/uploadController');

router.post('/get-leads', authenticateToken, getLeads);
router.post('/get-lead', authenticateToken, getLead);
router.post('/get-rows', authenticateToken, getRowLeads);
router.post('/get-row', authenticateToken, getRowLead);
router.post('/get-companies', getCompaniesListByLeadData);
router.post('/upload/media-alpha', uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', authenticateToken, uploadLeadFromUrl);
router.post('/upload/bulk-csv', authenticateToken, uploadCSV)

module.exports = router;