const router = require('express').Router();
const LeadMiddleware = require('../app/middleware/lead.middleware');
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const checkedAdminRole = AuthMiddleware.checkedAdminRole;
const checkAssignAgentLead = LeadMiddleware.checkAssignAgentLead;
const { test, getLeads, assignNewAgent, getLead, getCompaniesListByLeadData, uploadLeadFromMediaAlpha, getRawLeads, uploadLeadFromUrl, getBlueberryLeads, getMediaAlphaLeads } = require('../app/controller/lead.controller');
const { uploadCSV } = require('../app/controller/upload.controller');

router.post('/test', test);
router.get('/raws', authenticateToken, getRawLeads);
router.get('/all/:type/:user_id', authenticateToken, getLeads);
router.get('/:lead_id', authenticateToken, checkAssignAgentLead, getLead);
router.get('/all/blueberry', authenticateToken, checkedAdminRole, getBlueberryLeads);
router.get('/all/media-alpha', authenticateToken, checkedAdminRole, getMediaAlphaLeads);
router.post('/get-companies', getCompaniesListByLeadData);
router.post('/upload/bulk-csv', authenticateToken, uploadCSV)
router.post('/upload/media-alpha', uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', uploadLeadFromUrl);

module.exports = router;