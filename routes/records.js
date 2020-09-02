const router = require('express').Router();
const { getAllRecords } = require('../app/controller/recordsController');
const { authenticateToken } = require('../app/middleware/authMiddleware');

router.post('/get', authenticateToken, getAllRecords);

module.exports = router;