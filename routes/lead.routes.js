const router = require('express').Router();
const LeadMiddleware = require('../app/middleware/lead.middleware');
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const checkedAdminRole = AuthMiddleware.checkedAdminRole;
const { test, getLeads, assignNewAgent, getLead, getCompaniesListByLeadData, uploadLeadFromMediaAlpha, getRawLeads, uploadLeadFromUrl, getBlueberryLeads, getMediaAlphaLeads } = require('../app/controller/lead.controller');
const { uploadCSV } = require('../app/controller/upload.controller');

router.post('/test', test);
router.post('/get-raws', authenticateToken, getRawLeads);
router.post('/get-leads', authenticateToken, getLeads);
router.post('/get-lead', authenticateToken, LeadMiddleware.checkAssignAgentLead, getLead);
router.get('/get-leads/blueberry', authenticateToken, checkedAdminRole, getBlueberryLeads);
router.get('/get-leads/media-alpha', authenticateToken, checkedAdminRole, getMediaAlphaLeads);
router.post('/get-companies', getCompaniesListByLeadData);
router.post('/upload/bulk-csv', authenticateToken, uploadCSV)
router.post('/upload/media-alpha', uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', uploadLeadFromUrl);

module.exports = router;