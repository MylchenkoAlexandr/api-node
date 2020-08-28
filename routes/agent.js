const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/authMiddleware');
const { createAgent } = require('../app/controller/agentController');


router.post('/create', authenticateToken, createAgent);
// router.post('/update', verify);
// router.post('/delete', verify);

module.exports = router;