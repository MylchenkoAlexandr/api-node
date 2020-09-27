const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const checkedAdminRole = AuthMiddleware.checkedAdminRole;
const { getAgents, getSuitableAgents, createAgent, updateAgent, deleteAgent, updateAgentPassword } = require('../app/controller/agent.controller');

router.get('/', authenticateToken, checkedAdminRole, getAgents);
router.post('/suitable', authenticateToken, checkedAdminRole, getSuitableAgents);
router.post('/create', authenticateToken, checkedAdminRole, createAgent);
router.post('/update/:agent_id', authenticateToken, checkedAdminRole, updateAgent);
router.delete('/delete/:agent_id', authenticateToken, checkedAdminRole, deleteAgent);
router.post('/update-password/:agent_id', authenticateToken, updateAgentPassword);

module.exports = router;