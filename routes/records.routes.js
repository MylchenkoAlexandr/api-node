const router = require('express').Router();
const { getAllRecords, getOneRecord } = require('../app/controller/records.controller');
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

router.get('/all/:lead_id', authenticateToken, getAllRecords);
router.get('/:record_id', authenticateToken, getOneRecord);

module.exports = router;