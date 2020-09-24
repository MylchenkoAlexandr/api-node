const router = require('express').Router();
const { getAllRecords } = require('../app/controller/records.controller');
const { authenticateToken } = require('../app/middleware/auth.middleware');

router.get('/get/:lead_id', authenticateToken, getAllRecords);

module.exports = router;