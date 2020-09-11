const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/auth.middleware');
const { getAgents, createAgent, updateAgent, deleteAgent, updateAgentPassword } = require('../app/controller/agent.controller');

router.get('/', authenticateToken, getAgents);
router.post('/create', authenticateToken, createAgent);
router.post('/update/:agent_id', authenticateToken, updateAgent);
router.delete('/delete/:agent_id', authenticateToken, deleteAgent);
router.post('/update-password/:agent_id', authenticateToken, updateAgentPassword);

module.exports = router;