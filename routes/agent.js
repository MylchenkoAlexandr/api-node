const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/authMiddleware');
const { getAgents, getAgent, createAgent, updateAgent, deleteAgent, updateAgentPassword } = require('../app/controller/agentController');

router.get('/', getAgents);
router.get('/agent/:agent_id', getAgent);
router.post('/create', authenticateToken, createAgent);
router.post('/update/:agent_id', authenticateToken, updateAgent);
router.delete('/delete/:agent_id', authenticateToken, deleteAgent);
router.post('/update-password/:agent_id', authenticateToken, updateAgentPassword);

module.exports = router;