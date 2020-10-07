const router = require('express').Router();

const AuthMiddleware = require('../app/middleware/auth.middleware');

const authenticateToken = AuthMiddleware.authenticateToken;
const checkedAdminRole = AuthMiddleware.checkedAdminRole;

const { getAgents, getSuitableAgents, createAgent, updateAgent, deleteAgent, updateAgentPassword, completedLead, startWork, createScript, getAllScripts, deleteScript } = require('../app/controller/agent.controller');

router.get('/', authenticateToken, checkedAdminRole, getAgents);
router.post('/suitable', authenticateToken, checkedAdminRole, getSuitableAgents);
router.post('/create', authenticateToken, checkedAdminRole, createAgent);
router.put('/:agent_id', authenticateToken, checkedAdminRole, updateAgent);
router.delete('/:agent_id', authenticateToken, checkedAdminRole, deleteAgent);
router.put('/password/:agent_id', authenticateToken, updateAgentPassword);
router.patch('/:agent_id/completed_lead', authenticateToken, completedLead);
router.patch('/:agent_id/start-work/:lead_id', authenticateToken, startWork)
router.post('/scripts/create', createScript);
router.get('/scripts/:agent_id/:type_id', getAllScripts);
router.delete('/scripts/:script_id', deleteScript);

module.exports = router;