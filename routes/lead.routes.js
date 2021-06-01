const router = require('express').Router();

const LeadMiddleware = require('../app/middleware/lead.middleware');
const AuthMiddleware = require('../app/middleware/auth.middleware');

const authenticateToken = AuthMiddleware.authenticateToken;
const checkedAdminRole = AuthMiddleware.checkedAdminRole;
const findUncompletedLead = LeadMiddleware.findUncompletedLead;

const LeadController = require('../app/controller/lead.controller');
const UploadController = require('../app/controller/upload.controller');

router.get('/raws', authenticateToken, LeadController.getRawLeads);
router.get('/guide/all', authenticateToken, LeadController.getAllLeadsForGuide);
router.get('/all/:type/:user_id', authenticateToken, findUncompletedLead, LeadController.getLeads);
router.get('/:lead_id', authenticateToken, findUncompletedLead, LeadController.getLead);
router.get('/all/:source', authenticateToken, checkedAdminRole, LeadController.getLeadsBySource);
router.post('/get-companies', LeadController.getCompaniesListByLeadData);
router.post('/upload/bulk-csv', authenticateToken, UploadController.uploadCSV)
router.post('/upload/media-alpha', LeadController.uploadLeadFromMediaAlpha);
router.post('/upload/media-alpha/url', LeadController.uploadLeadFromUrl);
router.post('/filter', LeadController.getLeadsByFilters);
router.post('/delete', authenticateToken, LeadController.deteleLead);
router.post('/delete-selected', authenticateToken, LeadController.deleteSelectedLeads);
router.post('/upload/voice-mail-audio', authenticateToken, UploadController.uploadVoiceMailAudio);
router.post("/select-carrier", authenticateToken, LeadController.selectCarrier);
router.post("/reassign", authenticateToken, LeadController.assign);

module.exports = router;