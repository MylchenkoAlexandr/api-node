const router = require('express').Router();
const RecordsController = require('../app/controller/records.controller');
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

router.get('/all', authenticateToken, RecordsController.getAllRecords);
router.get('/lead/:lead_id', authenticateToken, RecordsController.getAllRecordsById);
router.get('/min-duration/:duration', authenticateToken, RecordsController.getRecordsByMinDuration);
router.get('/:record_id', authenticateToken, RecordsController.getOneRecord);

module.exports = router;