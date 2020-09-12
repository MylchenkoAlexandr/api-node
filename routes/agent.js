const router = require('express').Router();
const { authenticateToken, checkedAdminRole } = require('../app/middleware/auth.middleware');
const { getAgents, createAgent, updateAgent, deleteAgent, updateAgentPassword } = require('../app/controller/agent.controller');

router.get('/', authenticateToken, checkedAdminRole, getAgents);
router.post('/create', authenticateToken, checkedAdminRole, createAgent);
router.post('/update/:agent_id', authenticateToken, checkedAdminRole, updateAgent);
router.delete('/delete/:agent_id', authenticateToken, checkedAdminRole, deleteAgent);
router.post('/update-password/:agent_id', authenticateToken, updateAgentPassword);

module.exports = router;