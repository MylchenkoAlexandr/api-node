const router = require('express').Router();

const LeadMiddleware = require('../app/middleware/lead.middleware');
const AuthMiddleware = require('../app/middleware/auth.middleware');

const authenticateToken = AuthMiddleware.authenticateToken;
const checkedAdminRole = AuthMiddleware.checkedAdminRole;
const checkAssignAgentLead = LeadMiddleware.checkAssignAgentLead;
const findUncompletedLead = LeadMiddleware.findUncompletedLead;

const { test, getLeads, getLead, getCompaniesListByLeadData, uploadLeadFromMediaAlpha, getRawLeads, uploadLeadFromUrl, getBlueberryLeads, getMediaAlphaLeads, getManualLeads, getBulkLeads, getClickListingLeads } = require('../app/controller/lead.controller');
const { uploadCSV } = require('../app/controller/upload.controller');

router.post('/test', test);
router.get('/raws', authenticateToken, getRawLeads);
router.get('/all/:type/:user_id', authenticateToken, findUncompletedLead, getLeads);
router.get('/:lead_id', authenticateToken, findUncompletedLead, checkAssignAgentLead, getLead);
router.get('/all/blueberry', authenticateToken, checkedAdminRole, getBlueberryLeads);
router.get('/all/media-alpha', authenticateToken, checkedAdminRole, getMediaAlphaLeads);
router.get('/all/manual', authenticateToken, checkedAdminRole, getManualLeads);
router.get('/all/bulk', authenticateToken, checkedAdminRole, getBulkLeads);
router.get('/all/click-listing', authenticateToken, checkedAdminRole, getClickListingLeads);
router.post('/get-companies', getCompaniesListByLeadData);
router.post('/upload/bulk-csv', authenticateToken, uploadCSV)
router.post('/upload/media-alpha', uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', uploadLeadFromUrl);

module.exports = router;