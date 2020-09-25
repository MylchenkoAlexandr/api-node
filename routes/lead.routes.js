const router = require('express').Router();
const { authenticateToken, checkedAdminRole } = require('../app/middleware/auth.middleware');
const { test, getLeads, getLead, getCompaniesListByLeadData, uploadLeadFromMediaAlpha, getRawLeads, uploadLeadFromUrl, getBlueberryLeads, getMediaAlphaLeads } = require('../app/controller/lead.controller');
const { uploadCSV } = require('../app/controller/upload.controller');

router.post('/test', test);
router.post('/get-raws', authenticateToken, getRawLeads);
router.post('/get-leads', authenticateToken, getLeads);
router.get('/get-lead/:lead_id', authenticateToken, getLead);
router.get('/get-leads/blueberry', authenticateToken, checkedAdminRole, getBlueberryLeads);
router.get('/get-leads/media-alpha', authenticateToken, checkedAdminRole, getMediaAlphaLeads);
router.post('/get-companies', getCompaniesListByLeadData);
router.post('/upload/bulk-csv', authenticateToken, uploadCSV)
router.post('/upload/media-alpha', uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', uploadLeadFromUrl);

module.exports = router;