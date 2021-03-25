const router = require('express').Router();
const { getAllRecords, getOneRecord, getRecordsByMinDuration, getAllRecordsById } = require('../app/controller/records.controller');
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

router.get('/all', authenticateToken, getAllRecords);
router.get('/lead/:lead_id', authenticateToken, getAllRecordsById);
router.get('/min-duration/:duration', authenticateToken, getRecordsByMinDuration);
router.get('/:record_id', authenticateToken, getOneRecord);

module.exports = router;