const router = require('express').Router();

const AuthMiddleware = require('../app/middleware/auth.middleware');

const authenticateToken = AuthMiddleware.authenticateToken;
const checkedAdminRole = AuthMiddleware.checkedAdminRole;

const AgentController = require('../app/controller/agent.controller');

router.get('/', authenticateToken, checkedAdminRole, AgentController.getAgents);
router.post('/suitable', authenticateToken, checkedAdminRole, AgentController.getSuitableAgents);
router.post('/create', authenticateToken, checkedAdminRole, AgentController.createAgent);
router.put('/:agent_id', authenticateToken, checkedAdminRole, AgentController.updateAgent);
router.delete('/:agent_id', authenticateToken, checkedAdminRole, AgentController.deleteAgent);
router.put('/password/:agent_id', authenticateToken, AgentController.updateAgentPassword);
router.patch('/:agent_id/completed_lead', authenticateToken, AgentController.completedLead);
router.patch('/:agent_id/start-work/:lead_id', authenticateToken, AgentController.startWork);
router.get('/scripts/:agent_id/:type_id', authenticateToken, AgentController.getAllScripts);
router.post('/scripts/create', authenticateToken, AgentController.createScript);
router.patch('/scripts/:script_id', authenticateToken, AgentController.updateScript);
router.delete('/scripts/:script_id', authenticateToken, AgentController.deleteScript);
router.get('/online', authenticateToken, AgentController.getOnlineAgents);
router.get('/subroles', authenticateToken, AgentController.getSubroles);
router.post('/suitable/states', authenticateToken, AgentController.getSuitableAgentByStates);

module.exports = router;